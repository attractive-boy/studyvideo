from app import db

class CourseCategory(db.Model):
    __tablename__ = 'course_category'
    
    id = db.Column(db.Integer, primary_key=True)
    education_level = db.Column(db.String(50))
    subject = db.Column(db.String(50))

    def __init__(self, education_level, subject):
        self.education_level = education_level
        self.subject = subject

    #获取所有教育等级
    @staticmethod
    def get_all_education_level():
        return CourseCategory.query.with_entities(CourseCategory.education_level).distinct()
    
    #根据教育登记获取所有学科
    @staticmethod
    def get_all_subject_by_education_level(education_level): 
        return CourseCategory.query.with_entities(CourseCategory.subject).filter_by(education_level=education_level).distinct()
    
    def save(self):
        # 将实例添加到会话
        db.session.add(self)
        # 提交会话以保存更改
        db.session.commit()