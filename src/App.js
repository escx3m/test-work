import React, { useState, useEffect } from "react";
import './App.css';
import "antd/dist/antd.css";
import { Tree } from 'antd';
import axios from 'axios';
import { FileTextOutlined, FileImageOutlined } from '@ant-design/icons';

const { DirectoryTree } = Tree;

function updateTreeData(list, key, children, id) {
  return list.map((node) => {
    if (node.key === key) {
      return { ...node, children };
    }

    for (let item in children) {
      if (!children[item].children) {
        children[item].isLeaf = true;
        if (children[item].title.split(".")[1] === "epub") {
          children[item].icon = <FileTextOutlined />;
        } else if (children[item].title.split(".")[1] === "jpg") {
          children[item].icon = <FileImageOutlined />;
        }
      }
    }

    if (node.children) {
      return { ...node, children: updateTreeData(node.children, key, children, id) };
    }

    return node;
  });
}

function App() {

  const [data, setData] = useState([]);

  function onLoadData({ key, children, id }) {

    return new Promise((resolve, reject) => {
      if (!children) {
        resolve();
        return;
      }

      axios.get(`http://164.90.161.80:3000/api/content?dirId=${id}`)
        .then(({ data }) => {
          console.log("data", data);

          const items = data.children.map(el => ({
            ...el,
            key: el.id
          }))
          setData((origin) =>
            updateTreeData(origin, key, items, id),
          );
          console.log("DATA UPDATE", data);
          resolve();
        })
        .catch((err) => {
          console.log("err", err);
          reject();
        })
    });
  }

  useEffect(() => {
    axios.get("http://164.90.161.80:3000/api/content")
      .then(({ data }) => {
        // handle success
        console.log("data", data);
        const items = data.children.map(el => ({
          ...el,
          key: el.id
        }))
        setData(items);
      })
      .catch((err) => {
        console.log("err", err);
      })
  }, [])

  return (
    <div>
      <DirectoryTree loadData={onLoadData} treeData={data} multiple />
    </div>
  );
}

export default App;
