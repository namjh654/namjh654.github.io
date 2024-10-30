import React from "react";
import "../styles/Pages/Home.css";
import { FaUser, FaChartLine, FaTasks, FaBell } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* 상단 섹션: 프로필 정보 */}
      <div className="dashboard-header">
        <div className="user-profile">
          <img
            src="https://picsum.photos/80" // 프로필 이미지
            alt="User Profile"
            className="profile-image"
          />
          <h2 className="user-name">봉봉이</h2>
          <p className="user-role">Full Stack Developer</p>
        </div>
      </div>

      {/* 메인 통계 카드 섹션 */}
      <div className="stats-section">
        <div className="stat-card">
          <FaUser className="stat-icon" />
          <h3>사용자</h3>
          <p>1,245명</p>
        </div>
        <div className="stat-card">
          <FaChartLine className="stat-icon" />
          <h3>트래픽</h3>
          <p>50K</p>
        </div>
        <div className="stat-card">
          <FaTasks className="stat-icon" />
          <h3>작업 진행</h3>
          <p>23개</p>
        </div>
        <div className="stat-card">
          <FaBell className="stat-icon" />
          <h3>알림</h3>
          <p>5개</p>
        </div>
      </div>

      {/* 최근 활동 섹션 */}
      <div className="activity-section">
        <h3>최근 활동</h3>
        <ul className="activity-list">
          <li>새로운 프로젝트가 생성되었습니다.</li>
          <li>회원이 등록되었습니다.</li>
          <li>서버 상태가 업데이트되었습니다.</li>
          <li>5개의 알림이 도착했습니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
