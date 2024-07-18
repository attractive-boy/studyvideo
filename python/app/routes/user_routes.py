from flask import Blueprint, Flask, request, jsonify
import requests
import jwt
import datetime
from app.models.course import Course
from app.models.user import User
from config import Config

SECRET_KEY = Config.access_key_secret
bp = Blueprint('user', __name__)

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    code, nickname, avatar_url = data.get('code'), data.get('nickname'), data.get('avatarUrl')
    if not code:
        return jsonify({'success': False, 'message': '缺少 code 参数'}), 400

    app_id = Config.app_id
    app_secret = Config.app_secret

    url = 'https://api.weixin.qq.com/sns/jscode2session'
    params = {
        'appid': app_id,
        'secret': app_secret,
        'js_code': code,
        'grant_type': 'authorization_code'
    }

    try:
        response = requests.get(url, params=params)
        data = response.json()

        if 'openid' not in data or 'session_key' not in data:
            return jsonify({'success': False, 'message': '登录失败', 'data': data}), 400

        openid = data['openid']
        session_key = data['session_key']

        user = User.query.filter_by(open_id=openid).first()
        if user is None:
            user = User(open_id=openid, session_key=session_key, nickname=nickname, avatar_url=avatar_url)
            user.save()

        # 生成 JWT token
        token = generate_token(user.to_dict())

        return jsonify({'success': True, 'token': token})

    except Exception as e:
        return jsonify({'success': False, 'message': '登录请求失败', 'error': str(e)}), 500


def generate_token(user_info):
    payload = {
        'openId': user_info['openId'],
        'nickname': user_info['nickname']
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

# 获取用户信息
@bp.route('/user', methods=['GET'])
def get_user():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'success': False, 'message': '缺少 token 参数'}), 400
    
    try:
        payload = jwt.decode(token.encode('utf-8'), SECRET_KEY, algorithms=['HS256'])
        user_id = payload['openId']
        user = User.query.filter_by(open_id=user_id).first()
        if user is None:
            return jsonify({'success': False, 'message': '用户不存在'}), 404
        return jsonify({'success': True, 'data': user.to_dict()})
    
    except jwt.ExpiredSignatureError:
        return jsonify({'success': False, 'message': 'token 已过期'}), 401
    
# 获取某个课程授权的所有用户
@bp.route('/course/<int:course_id>/users', methods=['GET'])
def get_course_users(course_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'success': False, 'message': '缺少 token 参数'}), 400
    
    try:
        payload = jwt.decode(token.encode('utf-8'), SECRET_KEY, algorithms=['HS256'])

        course = Course.query.get(course_id)
        if course is None:
            return jsonify({'success': False, 'message': '课程不存在'}), 404
        
        authorized_users = Course.get_all_authorized_users(course_id)
        return jsonify({'success': True, 'data': authorized_users})
    
    except jwt.ExpiredSignatureError:
        return jsonify({'success': False, 'message': 'token 已过期'}), 401
    except Exception as e:
        return jsonify({'success': False, 'message': '获取课程授权的用户失败', 'error': str(e)}), 500
    
#获取某课程未被授权的用户
@bp.route('/course/<int:course_id>/unauthorized_users', methods=['GET'])
def get_unauthorized_users(course_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'success': False, 'message': '缺少 token 参数'}), 400
    
    try:
        payload = jwt.decode(token.encode('utf-8'), SECRET_KEY, algorithms=['HS256'])
        user_id = payload['openId']
        course = Course.query.get(course_id)
        if course is None:
            return jsonify({'success': False, 'message': '课程不存在'}), 404
        
        unauthorized_users = Course.get_all_unauthorized_users(user_id)
        return jsonify({'success': True, 'data': unauthorized_users})
    
    except jwt.ExpiredSignatureError:
        return jsonify({'success': False, 'message': 'token 已过期'}), 401
    
    except Exception as e:
        return jsonify({'success': False, 'message': '获取课程授权的用户失败', 'error': str(e)}), 500
    
#给课程添加用户 `/user/course/${id}/users/${selectedUser.id}`, 'POST'
@bp.route('/course/<int:course_id>/users/<int:user_id>', methods=['POST'])
def add_user_to_course(course_id, user_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'success': False, 'message': '缺少 token 参数'}), 400
    
    try:
        payload = jwt.decode(token.encode('utf-8'), SECRET_KEY, algorithms=['HS256'])
        course = Course.query.get(course_id)
        if course is None:
            return jsonify({'success': False, 'message': '课程不存在'}), 404
        
        Course.add_user_to_course(course, user_id)
        return jsonify({'success': True, 'message': '添加用户成功'})
    
    except jwt.ExpiredSignatureError:
        return jsonify({'success': False, 'message': 'token 已过期'}), 401
    
    except Exception as e:
        return jsonify({'success': False, 'message': '添加用户失败', 'error': str(e)}), 500
    
#移除课程授权用户
@bp.route('/course/<int:course_id>/users/<int:user_id>', methods=['DELETE'])
def remove_user_from_course(course_id, user_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'success': False, 'message': '缺少 token 参数'}), 400
    
    try:
        payload = jwt.decode(token.encode('utf-8'), SECRET_KEY, algorithms=['HS256'])
        course = Course.query.get(course_id)
        if course is None:
            return jsonify({'success': False, 'message': '课程不存在'}), 404
        
        Course.remove_user_from_course(course, user_id)
        return jsonify({'success': True, 'message': '移除用户成功'})
    
    except jwt.ExpiredSignatureError:
        return jsonify({'success': False, 'message': 'token 已过期'}), 401
    
    except Exception as e:
        return jsonify({'success': False, 'message': '移除用户失败', 'error': str(e)}), 500
    
