import { useEffect, useState } from "react";
import { Table, Card, Input, Button, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../store/slices/bookSlice";
import { borrowBook } from "../api/books";
import type { Book } from "../types/book";
import type { AppDispatch, RootState } from "../store";

const { Search } = Input;

const BookBorrow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { books, loading } = useSelector((state: RootState) => state.book);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleBorrow = async (bookId: string) => {
    try {
      await borrowBook(bookId);
      message.success("借阅成功");
      dispatch(fetchBooks());
    } catch {
      message.error("借阅失败");
    }
  };

  const columns: ColumnsType<Book> = [
    {
      title: "书名",
      dataIndex: "title",
      key: "title",
      filteredValue: searchText ? [searchText] : null,
      onFilter: (_, record) =>
        record.title.toLowerCase().includes(searchText.toLowerCase()),
    },
    {
      title: "作者",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      key: "isbn",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "available" ? "green" : "red"}>
          {status === "available" ? "可借" : "已借出"}
        </Tag>
      ),
    },
    {
      title: "位置",
      dataIndex: "location",
      key: "location",
      render: (location: Book["location"]) =>
        `${location.area}-${location.shelf}-${location.position}`,
    },
    {
      title: "操作",
      key: "action",
      render: (_, record: Book) => (
        <Button
          type="primary"
          disabled={record.status !== "available"}
          onClick={() => handleBorrow(record.id)}
        >
          借阅
        </Button>
      ),
    },
  ];

  return (
    <div className="page-container">
      <Card title="图书借阅">
        <div className="mb-4">
          <Search
            placeholder="搜索书名"
            allowClear
            enterButton
            className="max-w-md"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <Table
          columns={columns}
          dataSource={books}
          loading={loading}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
};

export default BookBorrow;
