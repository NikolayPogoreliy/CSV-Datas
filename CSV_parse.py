import sqlite3 as sq
import os
import csv
from fnmatch import filter as fn_filter
from datetime import datetime

CSV_DIR = "./data"
DB_NAME = './datas/data.sqlite3'
data_insertion = ['data', ('entity', 'value', 'string'), []]


# fnames = fn_filter(os.listdir('./data'), "*.csv")

# conn = sq.connect("data.sqlite3")
# cursor = conn.cursor()
TABLE = ('data',
         (
             "id INTEGER PRIMARY KEY",
             "value REAL NOT NULL",
             "entity TEXT NOT NULL",
             "string TEXT NOT NULL"
         ))


def get_file_names(file_dir=CSV_DIR, ext='*.csv'):
    # print(fn_filter(os.listdir(file_dir), ext))
    return fn_filter(os.listdir(file_dir), ext)


def create(x=TABLE):
    return "CREATE TABLE IF NOT EXISTS {} ({});".format(x[0], ', '.join(x[1]))


def insert(x=data_insertion):
    return "INSERT INTO {} ({}) VALUES ({});".format(x[0], ', '.join(x[1]), ', '.join(x[2]))


class DbConn:
    def __init__(self,db_name=DB_NAME):
        self.db_name = db_name

    def __enter__(self):
        self.conn = sq.connect(self.db_name)
        return self.conn

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.conn.commit()
        self.conn.close()
        if exc_val:
            raise


def get_encoding(file):
    encoding = ''
    with open(CSV_DIR+'/'+file, 'rb') as f:
        encoding = f.readline().decode().strip()[9:]
    return encoding


def process_file(file, enc, cursor, data=data_insertion[:]):
    try:
        with open(file, 'r', encoding=enc) as f:
            f.readline()
            reader = csv.reader(f)
            for row in reader:
                data[2] = ['\''+row[0]+'\'', row[1], '\''+row[2]+'\'']
                cursor.execute(insert(data))
    except:
        raise

# cursor.execute(create(table))
# encs = set()
# for file in fnames:
#     enc = ''
#     encs.add(enc)
#     try:
#         with open('./data/'+file, 'r', encoding=enc) as f:
#             f.readline()
#             reader = csv.reader(f)
#             for row in reader:
#                 data_insertion[2] = ['\''+row[0]+'\'', row[1], '\''+row[2]+'\'']
#                 cursor.execute(insert(data_insertion))
#     except UnicodeDecodeError as e:
#         print("File has wrong encoding: "+file+": enc="+enc+' ['+str(e)+']')
#         lenc = list(encs)
#         for en in lenc:
#             # print(en+" of "+str(lenc))
#             try:
#                 with open('./data/'+file, 'r', encoding=en) as f:
#                     f.readline()
#                     reader = csv.reader(f)
#                     for row in reader:
#                         data_insertion[2] = ['\'' + row[0] + '\'', row[1], '\'' + row[2] + '\'']
#                         cursor.execute(insert(data_insertion))
#                     print("File " + file + " is processed with enc=" + en + ' instead of ' + enc)
#                     break
#             except:
#                 print("Wrong encoding " + en)
#     except sq.OperationalError as e:
#         print("FATAL " + "[" + str(datetime.now()) + "] File has wrong data: " + file + ' [' + str(e) + ']')
#
#
# conn.commit()
# conn.close()

print(__name__)
if __name__ == "__main__":
    print("Entering")
    with DbConn() as conn:
        cursor = conn.cursor()
        cursor.execute(create())
        encs = set()
        fnames = get_file_names()
        print("Finded "+str(len(fnames))+" files")
        for file in fnames:
            enc = get_encoding(file)
            encs.add(enc)
            try:
                process_file(CSV_DIR+"/"+file, enc, cursor)
            except UnicodeDecodeError as e:
                print("File has wrong encoding: " + file + ": enc=" + enc + ' [' + str(e) + ']')
                for en in encs:
                    try:
                        process_file(CSV_DIR + "/" + file, en, cursor)
                        print("File " + file + " is processed with enc=" + en + ' instead of ' + enc)
                        break
                    except:
                        # print("Wrong encoding " + en)
                        pass
            except sq.OperationalError as e:
                print("FATAL " + "[" + str(datetime.now()) + "] File has wrong data: " + file + ' [' + str(e) + ']')
