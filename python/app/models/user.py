from datetime import datetime
from app import db

class User(db.Model):
    __tablename__ = 'user_list'

    id = db.Column(db.Integer, primary_key=True)
    open_id = db.Column(db.String(128), unique=True, nullable=False)
    session_key = db.Column(db.String(128), nullable=False)
    nickname = db.Column(db.String(128))
    avatar_url = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, open_id, session_key, nickname=None, avatar_url=None):
        self.open_id = open_id
        self.session_key = session_key
        self.nickname = nickname
        self.avatar_url = avatar_url

    def to_dict(self):
        return {
            'id': self.id,
            'openId': self.open_id,
            'nickname': self.nickname,
            'avatarUrl': self.avatar_url,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }

    def __repr__(self):
        return f'<User {self.nickname}>'
    #save
    def save(self):
        db.session.add(self)
        db.session.commit()
        return self
    
