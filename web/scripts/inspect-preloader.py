from pathlib import Path
js = Path(r"c:\Users\miche\Desktop\demo-omama\web\public\wp-content\themes\units\public\dist\scripts\main9031.js").read_text(encoding="utf-8", errors="ignore")
idx = js.find("this.preloader=document.querySelector")
print(js[idx-200:idx+4500])
