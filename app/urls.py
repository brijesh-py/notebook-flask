from .views import index, NoteBookViews, SearchNoteBookViews
from app import app, api


app.add_url_rule("/", view_func=index)
api.add_resource(NoteBookViews, '/notebooks/')
api.add_resource(SearchNoteBookViews, '/notebooks/search/<query>')
