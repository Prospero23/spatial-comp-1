from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def hello_world():
    print("connection")
    return render_template("index.html")


if __name__ == "__main__":
    from dotenv import load_dotenv

    # Load environment variables from .env file
    load_dotenv()

    # Access the environment variables
    # cert_file = os.getenv("CERT_PATH")
    # key_file = os.getenv("KEY_PATH")

    # app.run(host="0.0.0.0", port=8312, ssl_context=(cert_file, key_file), debug=True)
    app.run(debug=True)
