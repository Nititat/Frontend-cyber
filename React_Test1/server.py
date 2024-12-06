from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)

# Elasticsearch Configuration
ES_URL = "https://210.246.200.160:9200/wazuh-alerts*/_search"  # Replace with your Elasticsearch URL
ES_USERNAME = "admin"  # Replace with your Elasticsearch username
ES_PASSWORD = "ITULgIHEhZHb8vxX+"  # Replace with your Elasticsearch password

@app.route("/api/alerts", methods=["GET"])
def get_alerts():
    """
    ดึงข้อมูลทั้งหมดจาก Elasticsearch โดยใช้ query ที่ระบุ
    """
    try:
        # Elasticsearch Query
        query = {
            "query": {
                "term": {
                    "rule.groups": "attack"
                }
            }
        }

        # ส่งคำขอไปยัง Elasticsearch
        response = requests.post(
            ES_URL,
            auth=(ES_USERNAME, ES_PASSWORD),  # Basic Authentication
            headers={"Content-Type": "application/json"},
            data=json.dumps(query),  # Query ในรูปแบบ JSON
            verify=False  # ปิดการตรวจสอบ SSL (เฉพาะใน Development)
        )

        # ตรวจสอบสถานะ HTTP
        response.raise_for_status()

        # ดึงข้อมูล JSON จาก Elasticsearch
        data = response.json()
        hits = data.get("hits", {}).get("hits", [])

        # ส่งข้อมูลกลับในรูปแบบ JSON
        return jsonify(hits)

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error fetching alerts: {e}"}), 500


if __name__ == "__main__":
    app.run(debug=True)
