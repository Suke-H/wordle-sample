import React from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

export const Notes = () => {
  // 回答のCSSスタイル
  const noteStyle: React.CSSProperties = {
    marginBottom: "40px",
    marginTop: "100px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    color: "rgb(88, 88, 88)",

    fontFamily:  ["Inter", "system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"].join(','),
  };

  return (
    <div className="Notes" style={noteStyle}>
        <Divider
            sx={{
            borderBottomWidth: 3,
            width: "95%",
            }}
        />

        <ul>       
            <li>New York Times社の<a href="https://www.nytimes.com/games/wordle/index.html">WORDLE</a>
            をもとに作成した勉強用サイトです</li>
            <li>GitHubリポジトリは<a href="https://github.com/Suke-H/wordle-sample/">こちら</a></li>
        </ul> 

      <Button
        variant="contained"
        href="https://kakutory.com/"
        sx={{
          marginTop: { xs: "40px", md: "40px" },
          backgroundColor: "#585858",
          "&:hover": {
            backgroundColor: "#585858",
          },
        }}
      >
        Home
      </Button>
    </div>
  );
};
