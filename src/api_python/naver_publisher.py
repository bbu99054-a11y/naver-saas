from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pyperclip
import time
import os

app = FastAPI()

class PublishRequest(BaseModel):
    naver_id: str
    naver_pw: str
    title: str
    content_html: str

def copy_input(driver, xpath, text):
    pyperclip.copy(text)
    driver.find_element(By.XPATH, xpath).click()
    # macOS: COMMAND+V, Windows: CONTROL+V
    # We'll use CONTROL+V as default for Windows server
    driver.find_element(By.XPATH, xpath).send_keys(Keys.CONTROL, 'v')
    time.sleep(0.5)

@app.post("/publish")
def publish_to_naver(req: PublishRequest):
    # Setup Chrome options
    options = Options()
    # options.add_argument('--headless') # Headless mode might be blocked by Naver CAPTCHA easily
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    
    # User-agent spoofing to avoid bot detection
    options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    try:
        # 1. Login
        driver.get('https://nid.naver.com/nidlogin.login')
        time.sleep(2)
        
        # Bypass captcha using pyperclip
        copy_input(driver, '//*[@id="id"]', req.naver_id)
        copy_input(driver, '//*[@id="pw"]', req.naver_pw)
        
        driver.find_element(By.ID, 'log.login').click()
        time.sleep(3)
        
        # Check if login failed
        if "nidlogin.login" in driver.current_url:
            raise Exception("Login failed. Check ID/PW or CAPTCHA blocked.")

        # 2. Go to Blog Write Page
        driver.get(f'https://blog.naver.com/{req.naver_id}/postwrite')
        time.sleep(5)
        
        # Switch to SmartEditor iframe
        WebDriverWait(driver, 10).until(
            EC.frame_to_be_available_and_switch_to_it((By.ID, "mainFrame"))
        )
        
        # 3. Enter Title
        # 네이버 스마트에디터 ONE의 제목 입력창 클래스
        title_element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "se-ff-nanumgothic")) # Note: This selector might need adjustment based on Naver's DOM
        )
        title_element.click()
        pyperclip.copy(req.title)
        title_element.send_keys(Keys.CONTROL, 'v')
        time.sleep(1)
        
        # 4. Enter Content (HTML)
        # 본문 영역 클릭
        content_area = driver.find_element(By.CLASS_NAME, "se-component-content")
        content_area.click()
        
        # 본문 복사 후 붙여넣기
        # 주의: HTML 렌더링 된 상태를 붙여넣으려면 클립보드에 HTML 포맷으로 넣어야 하지만, 
        # pyperclip은 순수 텍스트만 지원하므로 실제 서비스에선 win32clipboard나 HTML 복사 라이브러리가 필요함.
        # 여기서는 POC 목적으로 텍스트로 붙여넣음.
        pyperclip.copy(req.content_html)
        content_area.send_keys(Keys.CONTROL, 'v')
        time.sleep(2)
        
        # 5. Publish
        publish_btn = driver.find_element(By.CSS_SELECTOR, "button.btn_publish")
        publish_btn.click()
        time.sleep(1)
        
        final_publish_btn = driver.find_element(By.CSS_SELECTOR, "button.btn_confirm")
        final_publish_btn.click()
        time.sleep(3)
        
        return {"success": True, "message": "Successfully published to Naver Blog."}

    except Exception as e:
        print(f"Error during publishing: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        driver.quit()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
