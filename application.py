from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash
from boto.dynamodb2 import regions
from boto.dynamodb2.layer1 import DynamoDBConnection
from boto.regioninfo import RegionInfo
from boto.dynamodb2 import connect_to_region
from boto.dynamodb2.items import Item
from boto.dynamodb2.fields import HashKey
from boto.dynamodb2.table import Table
import uuid
# from forms import RegistrationForm
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'

application = Flask(__name__)
application.config.from_object(__name__)

conn = DynamoDBConnection(
            region=RegionInfo(name='us-west-2',
                              endpoint='dynamodb.us-west-2.amazonaws.com'),
)
# application.logger.debug(conn.list_tables())
entities = Table('entities', connection=conn)

application.logger.debug(entities.get_item(entityname='peepee'))
# conn.get_table('entities')
# don't do this in production - use from_envvar

# user = Item(users, data={'username':'sam','boob':'big'})
# user.save(overwrite=True)

# en = users.get_item(username = 'sam')

@application.route('/')
def index():
    return 'Index Page'
#
@application.route('/form', methods=['GET', 'POST'])
def form():
    # form = RegistrationForm(request.form)
    form = []
    form.append({'name':'entity', 'text':'Input the name of your entity'})
    form.append({'name':'field1', 'text':"Input the name of your entity's first field"})
    form.append({'name':'field2', 'text':"Input the name of your entity's second field"})
    if request.method == 'POST':
        # form = request.form
        # user = User(form.username.data, form.email.data,
        #             form.password.data)
        # db_session.add(user)
        inputdata = {'entityname':request.form['entity'],'field1':request.form['field1'],'field2':request.form['field2']}
        application.logger.debug(inputdata)
        entities.put_item(data=inputdata)
        Table.create(request.form['entity'], schema=[HashKey('uuid')], connection=conn)
        # app.logger.debug(entities.get_item(entityname = form.entityname.data))
        flash('Thanks for registering')
        return redirect(url_for('index'))
    return render_template('form.html', form=form, action='/form')

@application.route('/seemyform/<ename>', methods=['GET', 'POST'])
def seemyform(ename):
    ent = entities.get_item(entityname=ename)
    acc = '/seemyform/'+ename
    form = []
    form.append({'name':'field1', 'text':ent['field1']})
    form.append({'name':'field2', 'text':ent['field2']})
    if request.method == 'POST':
        inputdata = {'uuid':str(uuid.uuid4()),ent['field1']:request.form['field1'],ent['field2']:request.form['field2']}
        curentity = Table(ename, connection=conn)
        curentity.put_item(data = inputdata)
    return render_template('form.html', form=form, action=acc)

@application.route('/seemylist/<ename>', methods=['GET'])
def seemylist(ename):
    entitytable = Table(ename, connection=conn)
    dictlist = [dict(inst) for inst in entitytable.scan()]
    application.logger.debug(dictlist)
    # return render_template('form.html', form=form, action=acc)
    return render_template('list.html', dictlist=dictlist)


if __name__ == '__main__':
    application.run()
