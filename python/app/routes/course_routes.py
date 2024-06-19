from flask import Blueprint, jsonify, request
from app.models.course_category import CourseCategory

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
