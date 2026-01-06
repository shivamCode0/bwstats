import { ImageResponse } from "next/og";
import { getStatsCached } from "@/lib/getStats";
import Image from "next/image";

// Image metadata
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image1({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  try {
    const data = await getStatsCached(username);

    if (!data || !data.success) {
      // Fallback image for users not found
      return new ImageResponse(
        (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              fontFamily: "system-ui",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                borderRadius: "32px",
                padding: "60px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: "72px",
                    fontWeight: "900",
                    color: "#dc2626",
                    marginBottom: "20px",
                  }}
                >
                  {username}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: "24px",
                    color: "#6b7280",
                    fontWeight: "600",
                  }}
                >
                  Player not found
                </div>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "30px",
                display: "flex",
                alignItems: "center",
                color: "white",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "12px 24px",
                  background: "rgba(255, 255, 255, 0.25)",
                  borderRadius: "20px",
                }}
              >
                🎮 bwstats.shivam.pro
              </div>
            </div>
          </div>
        ),
        size
      );
    }

    const stats = data.stats.modes.total;
    const fkdr = stats.finalDeaths > 0 ? (stats.finalKills / stats.finalDeaths).toFixed(2) : stats.finalKills.toFixed(2);
    const bblr = stats.bedsLost > 0 ? (stats.bedsBroken / stats.bedsLost).toFixed(2) : stats.bedsBroken.toFixed(2);
    const winRate = stats.gamesPlayed > 0 ? ((stats.wins / stats.gamesPlayed) * 100).toFixed(1) : "0.0";
    const cleanWins = stats.wins?.toLocaleString() || "0";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #be185d 100%)",
            fontFamily: "system-ui",
            position: "relative",
          }}
        >
          {/* Decorative bed icons in background */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "30px",
              display: "flex",
              fontSize: "40px",
              opacity: 0.15,
            }}
          >
            🛏️
          </div>
          <div
            style={{
              position: "absolute",
              top: "60px",
              right: "40px",
              display: "flex",
              fontSize: "35px",
              opacity: 0.2,
            }}
          >
            ⚔️
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "80px",
              left: "50px",
              display: "flex",
              fontSize: "30px",
              opacity: 0.15,
            }}
          >
            👑
          </div>

          {/* Main content card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "32px",
              padding: "50px",
              margin: "40px",
              width: "85%",
              maxWidth: "1000px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
              border: "3px solid rgba(255, 255, 255, 0.8)",
            }}
          >
            {/* Left side - Avatar and Level */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginRight: "60px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "6px",
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  borderRadius: "20px",
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
                }}
              >
                <Image
                  src={`https://api.mineatar.io/face/${data.uuid}?scale=1&overlay=true`}
                  alt={`${data.username} avatar`}
                  width={140}
                  height={140}
                  style={{
                    borderRadius: "16px",
                    imageRendering: "pixelated",
                  }}
                />
              </div>
              {/* Level badge */}
              <div
                style={{
                  display: "flex",
                  marginTop: "20px",
                  padding: "12px 20px",
                  background: "linear-gradient(135deg, #059669, #10b981)",
                  color: "white",
                  borderRadius: "25px",
                  fontSize: "20px",
                  fontWeight: "700",
                  boxShadow: "0 8px 20px -6px rgba(16, 185, 129, 0.5)",
                }}
              >
                ⭐ Level {data.stats.level}
              </div>
            </div>

            {/* Right side - Username and Stats */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              {/* Username */}
              <div
                style={{
                  display: "flex",
                  fontSize: "60px",
                  fontWeight: "900",
                  color: "#1f2937",
                  marginBottom: "30px",
                  letterSpacing: "-1px",
                }}
              >
                {data.username}
              </div>

              {/* Stats grid */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                }}
              >
                {[
                  { label: "Wins", value: cleanWins, color: "#10b981", bgColor: "#d1fae5", icon: "👑" },
                  { label: "FKDR", value: fkdr, color: "#ef4444", bgColor: "#fee2e2", icon: "⚔️" },
                  { label: "BBLR", value: bblr, color: "#8b5cf6", bgColor: "#ede9fe", icon: "🛏️" },
                  { label: "Win Rate", value: `${winRate}%`, color: "#f59e0b", bgColor: "#fef3c7", icon: "📊" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "20px 24px",
                      backgroundColor: stat.bgColor,
                      borderRadius: "16px",
                      border: `3px solid ${stat.color}`,
                      minWidth: "130px",
                      boxShadow: `0 8px 20px -8px ${stat.color}60`,
                    }}
                  >
                    <div style={{ display: "flex", fontSize: "28px", marginBottom: "6px" }}>{stat.icon}</div>
                    <div
                      style={{
                        display: "flex",
                        fontSize: "28px",
                        fontWeight: "800",
                        color: stat.color,
                        marginBottom: "4px",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        fontSize: "15px",
                        color: "#374151",
                        fontWeight: "600",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Website URL */}
          <div
            style={{
              position: "absolute",
              bottom: "30px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              color: "white",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "12px 24px",
                background: "rgba(255, 255, 255, 0.25)",
                borderRadius: "20px",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px -8px rgba(0, 0, 0, 0.3)",
              }}
            >
              🎮 bwstats.shivam.pro/user/{data.username}
            </div>
          </div>
        </div>
      ),
      size
    );
  } catch (error) {
    // Fallback image for errors
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            fontFamily: "system-ui",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              borderRadius: "32px",
              padding: "60px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: "72px",
                  fontWeight: "900",
                  color: "#dc2626",
                  marginBottom: "20px",
                }}
              >
                Error
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "24px",
                  color: "#6b7280",
                  fontWeight: "600",
                }}
              >
                Failed to load user data
              </div>
            </div>
          </div>
        </div>
      ),
      size
    );
  }
}
