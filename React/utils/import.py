import os
import pandas as pd
from sqlalchemy import create_engine, text
import requests
import sys
from contextlib import contextmanager

# Database configuration - better to use environment variables in production
PG_HOST = os.environ.get('POSTGRES_DB_HOST')
PG_PORT = os.environ.get('POSTGRES_DB_PORT')
PG_USER = os.environ.get('POSTGRES_DB_USERNAME')
PG_PASSWORD = os.environ.get('POSTGRES_DB_PASSWORD')
PG_DB = os.environ.get('POSTGRES_DB_NAME')

def download_file(url, output_path):
    """Download file with error handling"""
    try:
        print(f"Downloading file from {url}...")
        response = requests.get(url, timeout=30)
        response.raise_for_status()  # Raise exception for HTTP errors

        with open(output_path, 'wb') as f:
            f.write(response.content)

        print(f"File downloaded successfully to {output_path}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error downloading file: {e}")
        return False

@contextmanager
def get_db_connection():
    """Context manager for database connection"""
    connection_string = f'postgresql://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DB}'
    try:
        engine = create_engine(connection_string)
        conn = engine.connect()
        print("Database connection established")
        yield conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise
    finally:
        conn.close()
        engine.dispose()
        print("Database connection closed")

def main():
    # Source file information
    url = "https://psa.gov.ph/system/files/scd/PSGC-1Q-2025-Publication-Datafile.xlsx"
    output_path = 'psgc.xlsx'

    try:
        # Download the file
        if not download_file(url, output_path):
            return

        # Read and process the Excel file
        print("Reading Excel file...")
        df = pd.read_excel(output_path)

        # Check if expected columns exist
        expected_columns = ['10-digit PSGC', 'Name', 'Correspondence Code', 'Geographic Level']
        missing_columns = [col for col in expected_columns if col not in df.columns]
        if missing_columns:
            print(f"Error: Missing expected columns: {missing_columns}")
            return

        # Rename columns and convert data types
        df = df.rename(columns={
            '10-digit PSGC': 'psgc_code',
            'Name': 'name',
            'Correspondence Code': 'correspondence_code',
            'Geographic Level': 'geographic_level'
        })

        df['psgc_code'] = df['psgc_code'].astype(str)
        df['correspondence_code'] = df['correspondence_code'].astype(str)

        # Create table and import data
        with get_db_connection() as conn:
            # Create table if it doesn't exist
            create_table_query = """
            CREATE TABLE IF NOT EXISTS psgc_data (
                psgc_code VARCHAR(10) PRIMARY KEY,
                name VARCHAR(255),
                correspondence_code VARCHAR(9),
                geographic_level VARCHAR(10)
            );
            """
            conn.execute(text(create_table_query))
            conn.commit()

            # Import data
            print(f"Importing {len(df)} records to database...")
            df.to_sql('psgc_data', conn, if_exists='replace', index=False)

            print("✅ Data imported successfully to PostgreSQL!")

    except Exception as e:
        print(f"Error: {e}")
        return
    finally:
        # Clean up temporary file
        if os.path.exists(output_path):
            try:
                os.remove(output_path)
                print(f"Temporary file {output_path} removed")
            except OSError as e:
                print(f"Warning: Could not remove temporary file: {e}")

if __name__ == "__main__":
    main()