import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def fetch_table(table_name):
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    response = supabase.table(table_name).select("*").execute()
    if response.data:
        return response.data
    else:
        print("No data found or error occurred.")
        return []

if __name__ == "__main__":
    table_name = "attendance"  # Change to your table name if needed
    data = fetch_table(table_name)
    if data:
        # Print as a simple table
        headers = data[0].keys()
        print("\t".join(headers))
        for row in data:
            print("\t".join(str(row[h]) for h in headers))