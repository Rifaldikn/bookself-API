const { nanoid } = require("nanoid");
const books = require("./books");

const bookController = {
  createNewBook(request, h) {
    try {
      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = request.payload;

      if (!name) {
        throw {
          status: "fail",
          message: "Gagal menambahkan buku. Mohon isi nama buku",
          statusCode: 400,
        };
      }

      if (readPage > pageCount) {
        throw {
          status: "fail",
          message:
            "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
          statusCode: 400,
        };
      }

      const id = nanoid(16);
      const insertedAt = new Date().toISOString();
      const updatedAt = insertedAt;
      const finished = pageCount == readPage ? true : false;

      // console.log(finished);

      const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        insertedAt,
        updatedAt,
      };

      books.push(newBook);

      const isRecorded = books.find((book) => book.id === id);

      if (isRecorded) {
        const response = h.response({
          status: "success",
          message: "Buku berhasil ditambahkan",
          data: {
            bookId: id,
          },
        });
        response.code(201);
        return response;
      } else {
        throw {
          status: "fail",
          message: "Buku gagal ditambahkan",
          statusCode: 500,
        };
      }
    } catch (err) {
      const response = h.response({
        status: err.status,
        message: err.message,
      });
      response.code(err.statusCode);
      return response;
    }
  },

  filteredBook(query) {
    return filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  },

  getAllBooks(request, h) {
    try {
      const { reading, finished, name } = request.query;
      let filteredBook = [];

      if (reading) {
        filteredBook = books.filter((book) => book.reading == reading);
      } else if (finished) {
        filteredBook = books.filter((book) => book.finished == finished);
      } else if (name) {
        filteredBook = books.filter((book) =>
          book.name.toLowerCase().includes(name.toLowerCase())
        );
      } else {
        filteredBook = books;
      }

      const isValidated = filteredBook
        .filter((book) => book.name || book.id || book.publisher)
        .map((book) => {
          return { id: book.id, name: book.name, publisher: book.publisher };
        });

      console.log(isValidated);

      if (isValidated) {
        const response = h.response({
          status: "success",
          data: {
            books: isValidated,
          },
        });
        response.code(200);
        return response;
      }
    } catch (err) {
      const response = h.response({
        status: err.status,
        message: err.message,
      });
      response.code(err.statusCode);
      return response;
    }
  },

  getBookById(request, h) {
    try {
      const { id } = request.params;

      const selectedBook = books.find((book) => book.id == id);

      // console.log(selectedBook);
      if (selectedBook) {
        const response = h.response({
          status: "success",
          data: {
            book: selectedBook,
          },
        });
        response.code(200);
        return response;
      } else {
        throw {
          status: "fail",
          message: "Buku tidak ditemukan",
          statusCode: 404,
        };
      }
    } catch (err) {
      const response = h.response({
        status: err.status,
        message: err.message,
      });
      response.code(err.statusCode);
      return response;
    }
  },

  updateBookById(request, h) {
    try {
      const { id } = request.params;
      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = request.payload;

      const editedBookIndex = books.findIndex((book) => book.id === id);

      if (editedBookIndex == -1) {
        throw {
          status: "fail",
          message: "Gagal memperbarui buku. Id tidak ditemukan",
          statusCode: 404,
        };
      } else if (!name) {
        throw {
          status: "fail",
          message: "Gagal memperbarui buku. Mohon isi nama buku",
          statusCode: 400,
        };
      } else if (readPage > pageCount) {
        throw {
          status: "fail",
          message:
            "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
          statusCode: 400,
        };
      }

      const updatedAt = new Date().toISOString();

      Object.assign(books[editedBookIndex], {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      });
      const response = h.response({
        status: "success",
        message: "Buku berhasil diperbarui",
        data: {
          book: books[editedBookIndex],
        },
      });
      response.code(200);
      return response;
    } catch (err) {
      const response = h.response({
        status: err.status,
        message: err.message,
      });
      response.code(err.statusCode);
      return response;
    }
  },

  deleteBookById(request, h) {
    try {
      const { id } = request.params;

      const deltededBooksIndex = books.findIndex((note) => note.id === id);

      if (deltededBooksIndex == -1) {
        throw {
          status: "fail",
          message: "Buku gagal dihapus. Id tidak ditemukan",
          statusCode: 404,
        };
      }

      books.splice(deltededBooksIndex, 1);
      const response = h.response({
        status: "success",
        message: "Buku berhasil dihapus",
      });
      response.code(200);
      return response;
    } catch (err) {
      const response = h.response({
        status: err.status,
        message: err.message,
      });
      response.code(err.statusCode);
      return response;
    }
  },
};

module.exports = bookController;
