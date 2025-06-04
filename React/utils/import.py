import os
import pandas as pd
import gdown
from sqlalchemy import create_engine, text


# === credentials
PG_USER = ''
PG_PASSWORD = ''
PG_HOST = ''
PG_PORT = ''
PG_DB = ''

file_id = '1ECWKKyaYWm-UygvQI9ReO3vuEsMPce7d'
download_url = f'https://drive.google.com/uc?id={file_id}'
csv_path = 'psgc.csv'


if not os.path.exists(csv_path):
    print("📥 Downloading CSV from Google Drive...")
    gdown.download(download_url, csv_path, quiet=False)

df = pd.read_csv(csv_path, encoding='ISO-8859-1')

df = df.rename(columns={
    '10-digit PSGC': 'psgc_code',
    'Name': 'name',
    'Correspondence Code': 'correspondence_code',
    'Geographic Level': 'geographic_level'
})

df['psgc_code'] = df['psgc_code'].astype(str)
df['correspondence_code'] = df['correspondence_code'].astype(str)

engine = create_engine(f'postgresql://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DB}')

create_table_query = """
CREATE TABLE IF NOT EXISTS psgc_data (
    psgc_code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255),
    correspondence_code VARCHAR(9),
    geographic_level VARCHAR(10)
);
"""

with engine.connect() as conn:
    conn.execute(text(create_table_query))

df.to_sql('psgc_data', engine, if_exists='replace', index=False)

print(" CSV data imported to PostgreSQL!")

if os.path.exists(csv_path):
    os.remove(csv_path)
    print(" csv file deleted after import.")
else:
    print("⚠not found for deletion.")
