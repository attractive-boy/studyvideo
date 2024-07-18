from app import db
from app.models.user import User


authorized_users = db.Table('authorized_users',
    db.Column('course_id', db.Integer, db.ForeignKey('course_list.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user_list.id'), primary_key=True)
)

class Course(db.Model):
    __tablename__ = 'course_list'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    education_level = db.Column(db.String(50))
    subject = db.Column(db.String(50))
    oss_file_name = db.Column(db.String(100), nullable=False)
    #被授权的用户（多个）
    authorized_users = db.relationship('User', secondary=authorized_users, backref=db.backref('courses', lazy=True))

    def __init__(self, name, education_level, subject, oss_file_name):
        self.name = name
        self.education_level = education_level
        self.subject = subject
        self.oss_file_name = oss_file_name
    
    def to_dict( self ):
        return {
            'id': self.id,
            'name': self.name,
            'education_level': self.education_level,
            'subject': self.subject,
            'oss_file_name': self.oss_file_name
        }
    # 获取某个 education_level subject 的所有课程
    def get_all_courses_by_education_level_and_subject(education_level, subject):
        return Course.query.filter_by(education_level=education_level, subject=subject).all()
    

    def add_user_to_course(course, user_id):
        user = User.query.get(user_id)
        if course and user:
            course.authorized_users.append(user)
            db.session.commit()

    def remove_user_from_course(course, user_id):
        user = User.query.get(user_id)
        if course and user:
            course.authorized_users.remove(user)
            db.session.commit()

    def get_all_courses():
        return Course.query.all()
    
    def get_all_authorized_courses(user_id):
        return  Course.query.join(authorized_users, authorized_users.c.course_id == Course.id).filter(authorized_users.c.user_id == user_id).all()
    
    def get_all_authorized_courses_by_education_level_and_subject(education_level, subject, user):
        query = Course.query.join(authorized_users, authorized_users.c.course_id == Course.id).filter(authorized_users.c.user_id == user.id, Course.education_level == education_level, Course.subject == subject)
        print(query.statement.compile(compile_kwargs={"literal_binds": True}))       
        return query.all() 
    
    def get_course_by_id(course_id):
        return Course.query.get(course_id)

    def get_all_unauthorized_users(course_id):
        unauthorized_users_query = User.query.filter(
            ~User.id.in_(
                Course.query.join(
                    authorized_users,
                    authorized_users.c.user_id == User.id
                ).filter(
                    authorized_users.c.course_id == course_id
                ).with_entities(User.id)
            )
        )
        
        # 执行查询并转换每个User实例为字典
        unauthorized_users_list = [user.to_dict() for user in unauthorized_users_query.all()]
        
        return unauthorized_users_list
    
    def get_all_authorized_users(course_id):
        authorized_users_query = User.query.join(
            authorized_users,
            authorized_users.c.user_id == User.id
        ).filter(
            authorized_users.c.course_id == course_id
        )
        # 打印生成的SQL语句
        print(authorized_users_query.statement.compile(compile_kwargs={"literal_binds": True}))

        # 执行查询并转换每个User实例为字典
        authorized_users_list = [user.to_dict() for user in authorized_users_query.all()]
        return authorized_users_list
    def save(self):
        # 将实例添加到会话
        db.session.add(self)
        # 提交会话以保存更改
        db.session.commit()
        
    def delete(self):
        # 删除课程前，先处理相关的授权关系
        self.authorized_users.clear()  # 清除与用户的关联
        db.session.delete(self)  # 删除课程
        db.session.commit()  # 提交更改