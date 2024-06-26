from flask import Blueprint, jsonify, request
import jwt
from app.models.course_category import CourseCategory
from app.models.course import Course
from app.models.user import User
from app.routes.user_routes import get_user
from config import Config
import oss2
import json
from aliyunsdkcore.client import AcsClient

bp = Blueprint('course', __name__)
SECRET_KEY = Config.access_key_secret

# 获取所有教育等级
@bp.route('/education_levels', methods=['GET'])
def get_education_levels():
    education_levels = CourseCategory.get_all_education_level()
    return jsonify([level.education_level for level in education_levels])

# 根据教育等级获取所有学科
@bp.route('/subjects', methods=['GET'])
def get_subjects_by_education_level():
    education_level = request.args.get('education_level')
    if not education_level:
        return jsonify({'error': 'education_level is required'}), 400
    
    subjects = CourseCategory.get_all_subject_by_education_level(education_level)
    return jsonify([subject.subject for subject in subjects])

# 获取OSS存储桶中的文件列表
@bp.route('/oss_files', methods=['GET'])
def get_oss_files():
    bucket = Config.bucket
    file_list = []

    try:
        for obj in oss2.ObjectIterator(bucket):
            file_list.append(obj.key)
    except oss2.exceptions.OssError as e:
        return jsonify({'error': f'获取文件列表失败，错误信息: {e}'}), 500
    
    return jsonify(file_list)

# 获取指定文件的在线播放地址
@bp.route('/oss_file_url', methods=['GET'])
def get_oss_file_url():
    file_key = request.args.get('file_key')
    if not file_key:
        return jsonify({'error': 'file_key is required'}), 400

    try:
        bucket = Config.bucket
        
        # 生成带有签名的URL，有效期为3600秒（1小时）
        signed_url = bucket.sign_url('GET', file_key, 3600)
    except oss2.exceptions.OssError as e:
        return jsonify({'error': f'获取文件URL失败，错误信息: {e}'}), 500

    return jsonify({'signed_url': signed_url})

# 获取指定学科指定教育等级的课程列表
@bp.route('/courses', methods=['GET'])
def get_courses_by_education_level_and_subject():
    education_level = request.args.get('education_level')
    subject = request.args.get('subject')
    if not education_level or not subject:
        return jsonify({'error': 'education_level and subject are required'}), 400
    
    # courses = Course.get_all_courses_by_education_level_and_subject(education_level, subject)
    #只获取被授权的
    token = request.headers.get('Authorization')
    payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    user_id = payload['openId']
    user = User.query.filter_by(open_id=user_id).first()
    if not user:
        return jsonify({'error': '用户未登录'}), 401
    if user.role == 'admin':
        courses = Course.get_all_courses_by_education_level_and_subject(education_level, subject)
    else:
        courses = Course.get_all_authorized_courses_by_education_level_and_subject(education_level, subject, user)
    return jsonify([course.to_dict() for course in courses])

# 获取所有有权限的课程
@bp.route('/authorized_courses', methods=['GET'])
def get_authorized_courses():
    # 根据token 获取唯一id
    token = request.headers.get('Authorization')
    payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    user_id = payload['openId']
    user = User.query.filter_by(open_id=user_id).first()
    if not user:
        return jsonify({'error': '用户未登录'}), 401

    # 如果角色是管理者，则返回所有课程
    if user.role == 'admin':
        courses = Course.get_all_courses()
        return jsonify([course.to_dict() for course in courses])
    courses = Course.get_all_authorized_courses(user.id)
    return jsonify([course.to_dict() for course in courses])

#根据id获取课程
@bp.route('/course/<int:course_id>', methods=['GET'])
def get_course(course_id):
    course = Course.get_course_by_id(course_id)
    if not course:
        return jsonify({'error': '课程不存在'}), 404
    
    return jsonify(course.to_dict())

# 课程上传到阿里云OSS
@bp.route('/upload_to_oss', methods=['POST'])
def upload_to_oss():
    user = get_user()
    if not user:
        return jsonify({'error': '用户未登录'}), 401
    
    if 'file' not in request.files:
        return jsonify({'error': '未找到文件'}), 400
    
    file = request.files['file']
    bucket = Config.bucket
    bucket.put_object(f'/{education_level}/{subject}/{file.filename}', file)
    
    #写入数据库
    name = request.form.get('name', '').strip()
    education_level = request.form.get('education_level', '').strip()
    subject = request.form.get('subject', '').strip()
    
    course = Course(name, education_level, subject, file.filename)
    course.save()
    
    #添加表course_category
    course_category = CourseCategory(education_level, subject)
    course_category.save()

    return jsonify({'message': '上传成功'})

