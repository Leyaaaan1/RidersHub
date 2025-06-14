import os
import pandas as pd
from sqlalchemy import create_engine, text
import requests

# add your PostgreSQL credentials here
# host here
# pass and user

# Download directly from PSA website
url = "https://psa.gov.ph/system/files/scd/PSGC-1Q-2025-Publication-Datafile.xlsx"
output_path = 'psgc.xlsx'

response = requests.get(url)
with open(output_path, 'wb') as f:
    f.write(response.content)

csv_path = output_path

df = pd.read_excel(csv_path)
df = df.rename(columns={
    '10-digit PSGC': 'psgc_code',
    'Name': 'name',
    'Correspondence Code': 'correspondence_code',
    'Geographic Level': 'geographic_level'
})

df['psgc_code'] = df['psgc_code'].astype(str)
df['correspondence_code'] = df['correspondence_code'].astype(str)

# Create PostgreSQL engine
engine = create_engine(f'postgresql://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DB}')

# SQL to create the table
create_table_query = """
CREATE TABLE IF NOT EXISTS psgc_data (
    psgc_code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255),
    correspondence_code VARCHAR(9),
    geographic_level VARCHAR(10)
);
"""

# Create table
with engine.connect() as conn:
    conn.execute(text(create_table_query))  # ✅ wrap with text()

# Insert DataFrame into the table
df.to_sql('psgc_data', engine, if_exists='replace', index=False)

print("✅ CSV data imported successfully to PostgreSQL!")
