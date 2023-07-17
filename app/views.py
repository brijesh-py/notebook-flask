from app import Resource, db
from .models import NoteBook
from flask import jsonify, request
from datetime import datetime


def index():
    return "RestFul API"


class Helper:
    def date_finder(self, date):
        current_date = datetime.today()
        notebook_date = datetime.strptime(date, "%Y-%m-%d")
        time_difference = (current_date - notebook_date).days
        if time_difference < 7:
            return f"{time_difference} Days ago"
        elif time_difference >= 7 or time_difference <= 30:
            return f"{(time_difference // 7)} Weeks ago"
        elif time_difference >= 31 or time_difference < 365:
            return f"{(time_difference // 30)} Months ago"
        elif time_difference >= 365:
            return f"{(time_difference // 365)} Years ago"
        else:
            return "Error"


helper = Helper()


class NoteBookViews(Resource):
    def get(self):
        notebooks = NoteBook.query.all()
        temp = []
        for x in notebooks:
            temp.append(
                {
                    "id": x.id,
                    "note_book_title": x.note_book_title,
                    "note_book_content": x.note_book_content,
                    "create_at": helper.date_finder(x.create_at),
                }
            )
        return jsonify(temp)

    def post(self):
        data = request.get_json()
        note_book_title = data.get("note_book_title")
        note_book_content = data.get("note_book_content")
        noteBook = NoteBook(note_book_title, note_book_content)
        db.session.add(noteBook)
        db.session.commit()
        return jsonify(
            {
                "note_book_title": noteBook.note_book_title,
                "note_book_content": noteBook.note_book_content,
                "create_at": helper.date_finder(noteBook.create_at),
            }
        )

    def delete(self):
        data = request.get_json()
        notebook_id = data.get("id")
        noteBook = NoteBook.query.get(notebook_id)
        if noteBook:
            db.session.delete(noteBook)
            db.session.commit()
            return jsonify(
                {
                    "note_book_title": noteBook.note_book_title,
                }
            )
        else:
            return jsonify("Notebook not found")

    def put(self):
        data = request.get_json()
        notebook_id = data.get("id")
        noteBook = NoteBook.query.get(notebook_id)
        if noteBook:
            note_book_title = data.get("note_book_title")
            note_book_content = data.get("note_book_content")
            noteBook.note_book_title = note_book_title
            noteBook.note_book_content = note_book_content
            db.session.commit()
            return jsonify(
                {
                    "note_book_title": noteBook.note_book_title,
                    "note_book_content": noteBook.note_book_content,
                    "create_at": helper.date_finder(noteBook.create_at),
                }
            )
        else:
            return jsonify("Notebook not found")


class SearchNoteBookViews(Resource):
    def get(self, query):
        noteBook_by_title = NoteBook.query.filter(
            NoteBook.note_book_title.contains(query)
        ).all()
        noteBook_by_content = NoteBook.query.filter(
            NoteBook.note_book_content.contains(query)
        ).all()
        if noteBook_by_title or noteBook_by_content:
            temp = []
            if noteBook_by_content:
                for x in noteBook_by_content:
                    temp.append(
                        {
                            "id": x.id,
                            "note_book_title": x.note_book_title,
                            "note_book_content": x.note_book_content,
                            "create_at": helper.date_finder(x.create_at),
                        }
                    )
            return jsonify(temp)
        else:
            return jsonify("Notebook not found")
