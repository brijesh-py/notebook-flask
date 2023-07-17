from app import db
from datetime import datetime


class NoteBook(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.Integer, primary_key=True)
    note_book_title = db.Column(db.Text())
    note_book_content = db.Column(db.Text())
    create_at = db.Column(
        db.String, default=datetime.now().strftime("%Y-%m-%d")
    )

    def __init__(self, note_book_title, note_book_content):
        self.note_book_title = note_book_title
        self.note_book_content = note_book_content

    def __repr__(self):
        return f"<NoteBook {self.note_book_title}>"
