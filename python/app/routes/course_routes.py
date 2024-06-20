from flask import Blueprint, jsonify, request
from app.models.course_category import CourseCategory
from app.models.course import Course
from config import Config
import oss2
import json
from aliyunsdkcore.client import AcsClient
from aliyunsdkvod.request.v20170321.GetVideoInfoRequest import GetVideoInfoRequest

bp = Blueprint('course', __name__)

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
    
    courses = Course.get_all_courses_by_education_level_and_subject(education_level, subject)
    return jsonify([course.to_dict() for course in courses])
