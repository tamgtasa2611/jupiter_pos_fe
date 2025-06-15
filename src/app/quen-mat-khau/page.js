"use client";
import { Card, Typography, Button } from "antd";
import ChangePasswordForm from "@/components/admin/tai-khoan/ChangePasswordForm";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";

export default function ForgotPasswordPage() {
return (
    <div
        style={{
            minHeight: "100vh",
            background: "#f5f6fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
        }}
    >
        <Card
            style={{
                width: 400,
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                borderRadius: 12,
            }}
            styles={{ body: { padding: 32 } }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                    gap: 12,
                }}
            >
                <Link href="/dang-nhap" passHref legacyBehavior>
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<ArrowLeftOutlined />}
                        size="large"
                        style={{
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                    />
                </Link>
                <Typography.Title
                    level={3}
                    style={{
                        marginBottom: 0,
                        marginLeft: 30,
                        flex: 1,
                    }}
                >
                    Quên mật khẩu
                </Typography.Title>
            </div>
            <ChangePasswordForm />
        </Card>
    </div>
);
}