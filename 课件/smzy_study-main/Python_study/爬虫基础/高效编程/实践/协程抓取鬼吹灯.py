import asyncio
import os
import aiofiles
import aiohttp
import requests
from bs4 import BeautifulSoup


def get_page_source(web):
    headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36'
    }
    response = requests.get(web, headers=headers)
    response.encoding = 'utf-8'
    return response.text


def parse_page_source(html):
    book_list = []
    soup = BeautifulSoup(html, 'html.parser')
    a_list = soup.find_all('div', attrs={'class': 'mulu-list quanji'})
    for a in a_list:
        a_list = a.find_all('a')
        for href in a_list:
            chapter_url = href['href']
            book_list.append(chapter_url)
    return book_list


def get_book_name(book_page):
    book_number = book_page.split('/')[-1].split('.')[0]
    book_chapter_name = book_page.split('/')[-2]
    return book_number, book_chapter_name


async def aio_download_one(chapter_url, signal):
    number, c_name = get_book_name(chapter_url)
    for c in range(10):
        try:
            async with signal:
                async with aiohttp.ClientSession() as session:
                    async with session.get(chapter_url) as resp:
                        page_source = await resp.text()
                        soup = BeautifulSoup(page_source, 'html.parser')
                        chapter_name = soup.find('h1').text.replace(':','')
                        p_content = soup.find('div', attrs={'class': 'neirong'}).find_all('p')
                        content = [p.text + '\n' for p in p_content]
                        chapter_content = '\n'.join(content)
                        if not os.path.exists(f'{book_name}/{c_name}'):
                            os.makedirs(f'{book_name}/{c_name}')
                        async with aiofiles.open(f'{book_name}/{c_name}/{number}_{chapter_name}.txt', mode="w",
                                                 encoding='utf-8') as f:
                            await f.write(chapter_content)
                        print(chapter_url, "下载完毕!")
                        return ""
        except Exception as e:
            print(e)
            print(chapter_url, "下载失败!, 重新下载. ")
    return chapter_url


async def aio_download(url_list):
    tasks = []
    semaphore = asyncio.Semaphore(10)
    for h in url_list:
        tasks.append(asyncio.create_task(aio_download_one(h, semaphore)))
    await asyncio.wait(tasks)


if __name__ == '__main__':
    url = 'https://www.51shucheng.net/daomu/guichuideng'
    book_name = '鬼吹灯'
    if not os.path.exists(book_name):
        os.makedirs(book_name)
    source = get_page_source(url)
    href_list = parse_page_source(source)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(aio_download(href_list))
    loop.close()
    