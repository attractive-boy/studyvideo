from app import create_app
import ssl

app = create_app()

if __name__ == '__main__':
    # context = ssl.SSLContext(ssl.PROTOCOL_TLS)
    # context.load_cert_chain('www.wenshuaiyun.ltd.pem', 'www.wenshuaiyun.ltd.key')
    app.run(host='0.0.0.0',threaded=True)