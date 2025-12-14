class NewsData {
  constructor(id, title, content, imagesUrl, source, author) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.imagesUrl = imagesUrl;
    this.source = source;
    this.author = author;
  }
}

module.exports = NewsData;