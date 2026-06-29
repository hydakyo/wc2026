export const translateTeamName = (englishName: string): string => {
  const teamTranslations: Record<string, string> = {
    // Châu Âu
    "Germany": "Đức",
    "France": "Pháp",
    "England": "Anh",
    "Spain": "Tây Ban Nha",
    "Italy": "Ý",
    "Netherlands": "Hà Lan",
    "Portugal": "Bồ Đào Nha",
    "Belgium": "Bỉ",
    "Croatia": "Croatia",
    "Switzerland": "Thụy Sĩ",
    "Denmark": "Đan Mạch",
    "Sweden": "Thụy Điển",
    "Poland": "Ba Lan",
    // Nam Mỹ
    "Brazil": "Brazil",
    "Argentina": "Argentina",
    "Uruguay": "Uruguay",
    "Colombia": "Colombia",
    "Chile": "Chile",
    "Peru": "Peru",
    // Bắc/Trung Mỹ
    "United States": "Mỹ",
    "USA": "Mỹ",
    "Mexico": "Mexico",
    "Canada": "Canada",
    "Costa Rica": "Costa Rica",
    // Châu Á
    "Japan": "Nhật Bản",
    "South Korea": "Hàn Quốc",
    "Korea Republic": "Hàn Quốc",
    "Iran": "Iran",
    "Saudi Arabia": "Ả Rập Xê Út",
    "Australia": "Úc",
    "Qatar": "Qatar",
    "Vietnam": "Việt Nam", // :D
    // Châu Phi
    "Senegal": "Senegal",
    "Morocco": "Ma-rốc",
    "Cameroon": "Cameroon",
    "Ghana": "Ghana",
    "Tunisia": "Tunisia",
    "Nigeria": "Nigeria",
    "Egypt": "Ai Cập",
  };

  return teamTranslations[englishName] || englishName;
};

export const translateMatchStatus = (status: string): string => {
  const statusTranslations: Record<string, string> = {
    "Scheduled": "Đã lên lịch",
    "Full Time": "Kết thúc",
    "Half Time": "Nghỉ giữa hiệp",
    "First Half": "Hiệp 1",
    "Second Half": "Hiệp 2",
    "Extra Time": "Hiệp phụ",
    "Penalty Shootout": "Luân lưu",
    "Postponed": "Hoãn",
    "Canceled": "Hủy",
  };
  
  return statusTranslations[status] || status;
};
