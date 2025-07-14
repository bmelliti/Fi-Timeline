#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any

class FICalculatorBackendTester:
    def __init__(self, base_url="https://741246cc-dd1b-4d51-a6e5-49f35380c96b.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}: PASSED {details}")
        else:
            print(f"❌ {name}: FAILED {details}")

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                success = data.get("message") == "Hello World"
                details = f"- Status: {response.status_code}, Response: {data}"
            else:
                details = f"- Status: {response.status_code}, Error: {response.text}"
                
            self.log_test("Root Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("Root Endpoint", False, f"- Exception: {str(e)}")
            return False

    def test_create_status_check(self):
        """Test creating a status check"""
        try:
            test_data = {
                "client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"
            }
            
            response = self.session.post(f"{self.base_url}/api/status", json=test_data)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                required_fields = ["id", "client_name", "timestamp"]
                success = all(field in data for field in required_fields)
                success = success and data["client_name"] == test_data["client_name"]
                details = f"- Status: {response.status_code}, Created ID: {data.get('id', 'N/A')}"
                return success, data.get('id')
            else:
                details = f"- Status: {response.status_code}, Error: {response.text}"
                
            self.log_test("Create Status Check", success, details)
            return success, None
        except Exception as e:
            self.log_test("Create Status Check", False, f"- Exception: {str(e)}")
            return False, None

    def test_get_status_checks(self):
        """Test retrieving status checks"""
        try:
            response = self.session.get(f"{self.base_url}/api/status")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                success = isinstance(data, list)
                details = f"- Status: {response.status_code}, Count: {len(data) if isinstance(data, list) else 'N/A'}"
            else:
                details = f"- Status: {response.status_code}, Error: {response.text}"
                
            self.log_test("Get Status Checks", success, details)
            return success
        except Exception as e:
            self.log_test("Get Status Checks", False, f"- Exception: {str(e)}")
            return False

    def test_cors_headers(self):
        """Test CORS headers are present"""
        try:
            response = self.session.options(f"{self.base_url}/api/")
            cors_headers = [
                'Access-Control-Allow-Origin',
                'Access-Control-Allow-Methods',
                'Access-Control-Allow-Headers'
            ]
            
            success = any(header in response.headers for header in cors_headers)
            details = f"- CORS headers present: {success}"
            
            self.log_test("CORS Headers", success, details)
            return success
        except Exception as e:
            self.log_test("CORS Headers", False, f"- Exception: {str(e)}")
            return False

    def test_error_handling(self):
        """Test error handling for invalid requests"""
        try:
            # Test invalid endpoint
            response = self.session.get(f"{self.base_url}/api/nonexistent")
            success = response.status_code == 404
            details = f"- Invalid endpoint returns 404: {success}"
            
            self.log_test("Error Handling - 404", success, details)
            
            # Test invalid POST data
            response = self.session.post(f"{self.base_url}/api/status", json={})
            success = response.status_code in [400, 422]  # FastAPI returns 422 for validation errors
            details = f"- Invalid POST data returns {response.status_code}: {success}"
            
            self.log_test("Error Handling - Invalid Data", success, details)
            return True
        except Exception as e:
            self.log_test("Error Handling", False, f"- Exception: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting FI Calculator Backend Tests")
        print(f"📍 Testing URL: {self.base_url}")
        print("=" * 60)
        
        # Test basic connectivity
        self.test_root_endpoint()
        
        # Test CRUD operations
        success, created_id = self.test_create_status_check()
        self.test_get_status_checks()
        
        # Test CORS
        self.test_cors_headers()
        
        # Test error handling
        self.test_error_handling()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All backend tests passed!")
            return 0
        else:
            print("⚠️  Some backend tests failed!")
            return 1

def main():
    """Main test runner"""
    tester = FICalculatorBackendTester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())