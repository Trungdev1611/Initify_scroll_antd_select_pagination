import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, Spin } from "antd";

const App: React.FC = () => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchOptions = async (pageNumber: number) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const start = pageNumber - 1; // Convert page thành _start
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=20`
      );

      const data = response.data.map((post: { id: number; title: string }) => ({
        value: post.id.toString(),
        label: post.title,
      }));

      setOptions((prev) => [...prev, ...data]);

      // Nếu response không có data mới thì dừng load thêm
      if (response.data.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching options:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions(page);
  }, [page]);

  // Khi dropdown cuộn đến cuối -> load thêm dữ liệu
  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 100 && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <Select
      showSearch
      placeholder="Select a post"
      optionFilterProp="label"
      options={options}
      style={{ width: 300 }}
      onPopupScroll={handlePopupScroll} // Theo dõi sự kiện cuộn của dropdown
      dropdownRender={(menu) => (
        <>
          {menu}
          {loading && (
            <div style={{ textAlign: "center", padding: "8px" }}>
              <Spin />
            </div>
          )}
        </>
      )}
    />
  );
};

export default App;
