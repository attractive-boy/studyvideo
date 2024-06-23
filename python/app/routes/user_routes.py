from flask import Blueprint, Flask, request, jsonify
import requests
import jwt
import datetime
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
        'nickname': user_info['nickname'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # token 24小时后过期
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token
