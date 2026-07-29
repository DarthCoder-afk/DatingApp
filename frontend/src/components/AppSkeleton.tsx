type AppSkeletonProps = {
  variant: "cards" | "list" | "profile" | "chat";
};

const Line = ({ width = "100%" }: { width?: string }) => (
  <span className="app-skeleton-line" style={{ width }} />
);

export default function AppSkeleton({ variant }: AppSkeletonProps) {
  if (variant === "cards") {
    return (
      <div className="app-skeleton-grid" aria-label="Loading connections" aria-busy="true">
        {[0, 1, 2, 3].map((item) => (
          <div className="app-skeleton-card" key={item}>
            <span className="app-skeleton-photo" />
            <div className="app-skeleton-copy">
              <Line width="52%" />
              <Line width="88%" />
              <Line width="68%" />
              <span className="app-skeleton-button" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "profile") {
    return (
      <div className="app-skeleton-profile" aria-label="Loading profile" aria-busy="true">
        <div className="app-skeleton-profile-aside">
          <span className="app-skeleton-avatar" />
          <Line width="56%" />
          <Line width="34%" />
          <span className="app-skeleton-button" />
        </div>
        <div className="app-skeleton-profile-form">
          <Line width="28%" />
          {[0, 1, 2, 3].map((item) => <span className="app-skeleton-field" key={item} />)}
          <span className="app-skeleton-button" />
        </div>
      </div>
    );
  }

  if (variant === "chat") {
    return (
      <div className="app-skeleton-chat" aria-label="Loading conversation" aria-busy="true">
        <div className="app-skeleton-chat-head"><span className="app-skeleton-mini-avatar" /><Line width="30%" /></div>
        <div className="app-skeleton-chat-body">
          <span className="app-skeleton-bubble app-skeleton-bubble-left" />
          <span className="app-skeleton-bubble app-skeleton-bubble-right" />
          <span className="app-skeleton-bubble app-skeleton-bubble-left app-skeleton-bubble-short" />
        </div>
        <span className="app-skeleton-field" />
      </div>
    );
  }

  return (
    <div className="app-skeleton-list" aria-label="Loading conversations" aria-busy="true">
      {[0, 1, 2, 3, 4].map((item) => (
        <div className="app-skeleton-list-row" key={item}>
          <span className="app-skeleton-mini-avatar" />
          <div><Line width="42%" /><Line width="78%" /></div>
          <Line width="100%" />
        </div>
      ))}
    </div>
  );
}
