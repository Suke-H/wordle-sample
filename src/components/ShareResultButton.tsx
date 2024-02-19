import React, { useState } from 'react';
import Button from "@mui/material/Button";
import Snackbar from '@mui/material/Snackbar';
import type { SnackbarCloseReason } from '@mui/material/Snackbar';

type Props = {
    resultText: string;
  };

export const ShareResultButton = (props: Props): JSX.Element => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    
    const handleCopyText = () => {
        const textToCopy = props.resultText; // コピーしたいテキスト
        navigator.clipboard.writeText(textToCopy).then(() => {
            setOpenSnackbar(true);
        }).catch(err => {
          console.error('テキストのコピーに失敗しました:', err);
        });
    };

      // スナックバーを閉じる関数
    const handleCloseSnackbar = (event?: Event | React.SyntheticEvent<unknown, Event>, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
        return; // クリックアウェイ時はスナックバーを閉じない
        }
        setOpenSnackbar(false);
    };

    return (
        <>
            <Button
            variant="contained"
            onClick={handleCopyText}
            sx={{
            marginTop: { xs: "40px", md: "40px" },
            backgroundColor: "#585858",
            "&:hover": {
                backgroundColor: "#585858",
            },
            }}
        >
            Result
        </Button>

        <Snackbar
            open={openSnackbar}
            autoHideDuration={2000} // 6秒後に自動的に閉じる
            onClose={handleCloseSnackbar}
            message="Copied!" // 表示するメッセージ
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // 表示位置
        />
        </>
    )

}
  