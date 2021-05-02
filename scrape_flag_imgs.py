import requests
from bs4 import BeautifulSoup
import os

url = "https://www.worldometers.info/geography/flags-of-the-world/"

r = requests.get(url)
soup = BeautifulSoup(r.text, 'html.parser')

images = soup.find_all('img')

for image in images:
    print(f'https://www.worldometers.info',image['src'])