from app import db

class Course(db.Model):
    __tablename__ = 'course_list'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    education_level = db.Column(db.String(50))
    subject = db.Column(db.String(50))
    oss_file_name = db.Column(db.String(100), nullable=False)

    def __init__(self, name, education_level, subject, upload_time, oss_file_name):
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