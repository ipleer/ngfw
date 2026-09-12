import React, { useEffect, useRef, useState } from "react";
import { BarChart, TrendChart, Locations } from "./Charts.jsx";
export const asset = (name) => "/assets/" + name + ".svg";
export function Icon({ name, size = 16, className = "" }) {
  return (
    <img
      className={"icon " + className}
      src={asset(name)}
      width={size}
      height={size}
      alt=""
    />
  );
}
function IconButton({ name, label, onClick, className = "", ...props }) {
  return (
    <button
      type="button"
      className={"icon-button " + className}
      aria-label={label}
      title={label}
      onClick={onClick}
      {...props}
    >
      <Icon name={name} />
    </button>
  );
}
const initialDevices = [
  "NGFW-01",
  "Cluster-2-1",
  "NGFW-02",
  "NGFW-03",
  "NGFW-04",
  "NGFW-05",
  "NGFW-06",
];
const deviceTableColumns = [
  "Name",
  "State",
  "Model",
  "MGMT address",
  "Antivirus",
  "Applications",
  "GeoIP",
  "IPS",
  "Product version",
  "Software version",
  "Edited",
];
const groups = [
  { name: "Virtual contexts", children: ["System"] },
  { name: "Interfaces" },
  { name: "vWires" },
  {
    name: "Routing",
    children: [
      "Virtual Routers",
      "Static routes",
      "OSPF",
      "OSPF profiles",
      "BGP",
      "BGP profiles",
      "Prefix-lists",
      "Policy based routing",
      "Reachability check",
      "BFD profiles",
      "Multicast",
    ],
  },
  {
    name: "VPN/Tunnels",
    children: ["IPsec Site-to-Site", "GRE", "Remote Access"],
  },
  { name: "DHCP" },
  { name: "QoS" },
];
const counters = [
  ["Interfaces", 24],
  ["Virtual contexts", 1],
  ["Virtual routers", 0],
  ["Virtual wires", 2],
];
function MainBar({ collapsed, onCollapse }) {
  return (
    <aside
      className={"mainbar " + (collapsed ? "collapsed" : "")}
      aria-label="Main navigation"
    >
      <div>
        <div className="brand">
          <img src={asset("logo")} width="24" height="24" alt="TT NGFW" />
          {!collapsed && (
            <img
              className="wordmark"
              src={asset("wordmark")}
              width="86.44"
              height="13.68"
              alt=""
            />
          )}
          <IconButton
            name="panel16"
            label={
              collapsed ? "Expand main navigation" : "Collapse main navigation"
            }
            onClick={onCollapse}
          />
        </div>
        <div className="main-links">
          {["Policies", "Objects", "Devices", "Logs", "Settings"].map((n) => (
            <div
              key={n}
              title={n}
              className={"main-link " + (n === "Devices" ? "active" : "")}
              aria-current={n === "Devices" ? "page" : undefined}
            >
              <Icon name={n === "Devices" ? "device16" : "superadmin16"} />
              {!collapsed && <span>{n}</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="main-bottom">
        {["Push to device", "Lock system", "Admin"].map((n) => (
          <div title={n} key={n} className="main-link">
            <Icon name="superadmin16" />
            {!collapsed && <span>{n}</span>}
          </div>
        ))}
        <img
          className="avatar"
          src="/assets/avatar.png"
          alt="Administrator"
          width="32"
          height="32"
        />
      </div>
    </aside>
  );
}
function DeviceNavigation({ collapsed, onCollapse, onInfo }) {
  const [closed, setClosed] = useState({});
  return (
    <nav
      className={"device-nav " + (collapsed ? "narrow" : "")}
      aria-label="Device navigation"
    >
      <div className="nav-summary">
        <span>
          <Icon name="zone16" />
          {!collapsed && "Summary"}
        </span>
        <IconButton
          name="collapse16"
          label={
            collapsed
              ? "Expand device navigation"
              : "Collapse device navigation"
          }
          onClick={onCollapse}
        />
      </div>
      {!collapsed && (
        <>
          <div className="nav-groups">
            {groups.map((g) => (
              <div
                className={"nav-group group-" + g.name.replaceAll("/", "-")}
                key={g.name}
              >
                <button
                  className="nav-row"
                  onClick={() =>
                    g.children
                      ? setClosed({ ...closed, [g.name]: !closed[g.name] })
                      : onInfo(g.name)
                  }
                  aria-expanded={g.children ? !closed[g.name] : undefined}
                >
                  <Icon name="superadmin16" />
                  <span>{g.name}</span>
                  {g.children && (
                    <Icon
                      name="chevronDown16"
                      className={closed[g.name] ? "rotated" : ""}
                    />
                  )}
                </button>
                {g.children && !closed[g.name] && (
                  <div className="nav-children">
                    {g.children.map((c) => (
                      <button
                        className="nav-child"
                        key={c}
                        onClick={() => onInfo(c)}
                      >
                        <Icon name="interface16" />
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="nav-row system" onClick={() => onInfo("System")}>
            <Icon name="settings16" />
            <span>System</span>
          </button>
        </>
      )}
    </nav>
  );
}
function Dialog({ title, children, onClose }) {
  const ref = useRef(null),
    closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement;
    ref.current?.focus();
    function key(e) {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "Tab") {
        const nodes = ref.current?.querySelectorAll("button,input,select");
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, []);
  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex="-1"
        className="dialog"
      >
        <div className="dialog-heading">
          <h2>{title}</h2>
          <button className="text-button" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
export function App() {
  const [devices, setDevices] = useState(initialDevices),
    [selected, setSelected] = useState("NGFW-02"),
    [search, setSearch] = useState("");
  const [localSearch, setLocalSearch] = useState(false),
    [sort, setSort] = useState(false),
    [type, setType] = useState("all");
  const [mainCollapsed, setMainCollapsed] = useState(false),
    [navCollapsed, setNavCollapsed] = useState(false),
    [hideDevices, setHideDevices] = useState(false),
    [expanded, setExpanded] = useState(false);
  const [devicePaneWidth, setDevicePaneWidth] = useState(240),
    [viewportWidth, setViewportWidth] = useState(() => window.innerWidth),
    [resizing, setResizing] = useState(false);
  const [popover, setPopover] = useState(false),
    [dialog, setDialog] = useState(null),
    [deviceName, setDeviceName] = useState(""),
    [error, setError] = useState(""),
    [scope, setScope] = useState("Global"),
    [toast, setToast] = useState("");
  const popoverRef = useRef(null),
    workspaceRef = useRef(null),
    closeDialog = () => {
      setDialog(null);
      setError("");
    };
  const getDevicePaneMax = () =>
    Math.max(180, (workspaceRef.current?.clientWidth ?? viewportWidth) - 496);
  useEffect(() => {
    function key(e) {
      if (e.key === "Escape") {
        setPopover(false);
        setExpanded(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    }
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    if (!popover) return;
    function close(e) {
      if (!popoverRef.current?.contains(e.target)) setPopover(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [popover]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    function resize() {
      setViewportWidth(window.innerWidth);
      const workspaceWidth = workspaceRef.current?.clientWidth;
      if (!workspaceWidth) return;
      setDevicePaneWidth((width) => Math.min(width, getDevicePaneMax()));
    }
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    if (!resizing) return;
    function move(e) {
      const rect = workspaceRef.current?.getBoundingClientRect();
      if (!rect) return;
      const max = Math.max(180, rect.width - 496);
      setDevicePaneWidth(Math.min(max, Math.max(180, e.clientX - rect.left)));
    }
    function stop() {
      setResizing(false);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop, { once: true });
    window.addEventListener("pointercancel", stop, { once: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [resizing]);
  const filtered = devices.filter(
    (n) =>
      n.toLowerCase().includes(search.toLowerCase()) &&
      (type === "all" ||
        (type === "cluster"
          ? n.startsWith("Cluster")
          : !n.startsWith("Cluster"))),
  );
  if (sort) filtered.sort((a, b) => a.localeCompare(b));
  const tableMode = viewportWidth > 600 && devicePaneWidth >= viewportWidth * 0.3;
  const resizeDevicePaneBy = (delta) => {
    const max = getDevicePaneMax();
    setDevicePaneWidth((width) => Math.min(max, Math.max(180, width + delta)));
  };
  const factor =
    selected === "NGFW-02"
      ? 1
      : 0.74 + (Math.max(0, devices.indexOf(selected) - 2) + 1) * 0.08;
  const info = (name) => setDialog({ kind: "info", title: name });
  const addDevice = (e) => {
    e.preventDefault();
    const value = deviceName.trim();
    if (!value) {
      setError("Enter a device name.");
      return;
    }
    if (devices.some((n) => n.toLowerCase() === value.toLowerCase())) {
      setError("A device with this name already exists.");
      return;
    }
    setDevices([...devices, value]);
    setSelected(value);
    setSearch("");
    setType("all");
    setDeviceName("");
    closeDialog();
    setToast(value + " added");
  };
  return (
    <div
      className={
        "app " +
        (mainCollapsed ? "main-collapsed " : "") +
        (new URLSearchParams(window.location.search).has("reference")
          ? "reference-mode"
          : "")
      }
    >
      <MainBar
        collapsed={mainCollapsed}
        onCollapse={() => setMainCollapsed(!mainCollapsed)}
      />
      <header className="toolbar">
        <h1>Devices</h1>
        <label className="scope">
          <Icon name="hierarhy" />
          <select
            aria-label="Context"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          >
            <option>Global</option>
            <option>System</option>
          </select>
          <Icon name="chevronDown16" />
        </label>
        <div className="toolbar-actions" ref={popoverRef}>
          <IconButton
            name="FilterIcon"
            label="Filter devices"
            className={"outlined " + (type !== "all" ? "applied" : "")}
            aria-expanded={popover}
            onClick={() => setPopover(!popover)}
          />
          <div className="search">
            <Icon name="search" />
            <input
              id="global-search"
              aria-label="Search devices"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="clear-search">
                Clear
              </button>
            )}
          </div>
          <IconButton
            name="Menu_new"
            className="outlined"
            label={hideDevices ? "Show device list" : "Hide device list"}
            onClick={() => setHideDevices(!hideDevices)}
          />
          {popover && (
            <div className="popover filter-popover">
              <strong>Device type</strong>
              {[
                ["all", "All devices"],
                ["device", "Firewalls"],
                ["cluster", "Clusters"],
              ].map(([v, l]) => (
                <label key={v}>
                  <input
                    type="radio"
                    name="device-type"
                    checked={type === v}
                    onChange={() => setType(v)}
                  />
                  {l}
                </label>
              ))}
              <button
                className="text-button"
                onClick={() => {
                  setType("all");
                  setSearch("");
                  setPopover(false);
                }}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </header>
      <main
        ref={workspaceRef}
        className={
          "workspace " +
          (hideDevices ? "hide-devices " : "") +
          (resizing ? "is-resizing" : "")
        }
        style={{ "--device-list-width": devicePaneWidth + "px" }}
      >
        {!hideDevices && (
          <>
            <aside
              className={"device-list " + (tableMode ? "table-mode" : "card-mode")}
              aria-label="Devices"
              data-layout={tableMode ? "table" : "cards"}
            >
              <div className="device-actions">
                <IconButton
                  name="plus16"
                  label="Add device"
                  className="primary-square"
                  onClick={() =>
                    setDialog({ kind: "add", title: "Add device" })
                  }
                />
                <span className="small-rule" />
                <details className="device-options">
                  <summary aria-label="Device list options">
                    <Icon name="ellipsisVertical16" />
                  </summary>
                  <div className="popover">
                    <label>
                      <input
                        type="checkbox"
                        checked={sort}
                        onChange={(e) => setSort(e.target.checked)}
                      />
                      Sort by name
                    </label>
                    <button
                      className="text-button"
                      onClick={() => {
                        setSearch("");
                        setType("all");
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                </details>
                <IconButton
                  name="search"
                  label="Search in device list"
                  onClick={() => setLocalSearch(!localSearch)}
                />
              </div>
              {localSearch && (
                <input
                  autoFocus
                  className="local-search"
                  aria-label="Device name"
                  placeholder="Device name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              )}
              {tableMode ? (
                <div className="device-table-scroll">
                  <div className="device-table" role="table" aria-label="Device details">
                    <div className="device-table-head" role="rowgroup">
                      <span className="content-updates">Content updates</span>
                      {deviceTableColumns.map((column, index) => (
                        <span
                          className={
                            (index < 4 || index > 7 ? "ungrouped " : "") +
                            (index === 0 ? "first-column" : "")
                          }
                          style={{ "--column": index + 1 }}
                          role="columnheader"
                          key={column}
                        >
                          {column}
                        </span>
                      ))}
                    </div>
                    <div className="device-table-body" role="rowgroup">
                      {filtered.map((n) => {
                        const row = [
                          n,
                          "Connected",
                          "pt-ngfw-vm-1010",
                          "10.12.100.71",
                          "",
                          "",
                          "",
                          "",
                          "1.12.1",
                          "3.4.1.234",
                          "12 jun, 11:11",
                        ];
                        return (
                          <button
                            className={
                              "device-table-row " +
                              (n === selected ? "selected" : "")
                            }
                            role="row"
                            key={n}
                            onClick={() => setSelected(n)}
                            aria-pressed={n === selected}
                          >
                            {row.map((value, index) => (
                              <span className="device-table-cell" role="cell" key={index}>
                                {index === 0 && (
                                  <Icon
                                    name={
                                      n.startsWith("Cluster")
                                        ? "cluster24-2"
                                        : "device24"
                                    }
                                    size={24}
                                  />
                                )}
                                {index === 1 && (
                                  <img
                                    src={asset("Badge")}
                                    width="6"
                                    height="6"
                                    alt=""
                                  />
                                )}
                                <span>{value}</span>
                              </span>
                            ))}
                          </button>
                        );
                      })}
                    </div>
                    <div className="device-table-footer">{filtered.length} in total</div>
                  </div>
                </div>
              ) : (
                <div className="device-items">
                  {filtered.map((n) => (
                    <button
                      className={
                        "device-item " + (n === selected ? "selected" : "")
                      }
                      key={n}
                      onClick={() => setSelected(n)}
                      aria-pressed={n === selected}
                    >
                      <div className="device-name">
                        <Icon
                          name={
                            n.startsWith("Cluster") ? "cluster24-2" : "device24"
                          }
                          size={24}
                        />
                        <strong>{n}</strong>
                      </div>
                      <div className="device-sub">
                        <span>pt-ngfw-vm-1010</span>
                        <span className="status">
                          <img src={asset("Badge")} width="6" height="6" alt="" />
                          Connected
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {filtered.length === 0 && (
                <div className="empty">
                  <strong>No devices found</strong>
                  <p>Try another name or clear the filters.</p>
                  <button
                    className="text-button"
                    onClick={() => {
                      setSearch("");
                      setType("all");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </aside>
            <div
              className="splitter"
              role="separator"
              aria-label="Resize device list"
              aria-orientation="vertical"
              aria-valuemin="180"
              aria-valuemax={Math.round(getDevicePaneMax())}
              aria-valuenow={Math.round(devicePaneWidth)}
              tabIndex="0"
              onPointerDown={(e) => {
                if (e.button !== 0) return;
                e.preventDefault();
                setResizing(true);
              }}
              onDoubleClick={() => setDevicePaneWidth(240)}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") resizeDevicePaneBy(-16);
                else if (e.key === "ArrowRight") resizeDevicePaneBy(16);
                else if (e.key === "Home") setDevicePaneWidth(180);
                else if (e.key === "End")
                  resizeDevicePaneBy(viewportWidth);
                else return;
                e.preventDefault();
              }}
            >
              <Icon name="splitter16" />
            </div>
          </>
        )}
        {expanded && (
          <div
            className="expanded-backdrop"
            onClick={() => setExpanded(false)}
          />
        )}
        <section
          className={"device-panel " + (expanded ? "expanded" : "")}
          aria-label={selected + " overview"}
        >
          <div className="panel-header">
            <div className="device-title">
              <h2>
                <Icon name="device-dark" size={24} />
                {selected}
              </h2>
              <span className="status">
                <img src={asset("Badge")} width="6" height="6" alt="" />
                Connected
              </span>
            </div>
            <div className="counter-pills">
              {counters.map(([name, value], i) => (
                <button
                  className={"counter-pill " + (i === 0 ? "first" : "")}
                  key={name}
                  onClick={() => info(name)}
                >
                  {name}
                  <span className={"badge " + (value === 0 ? "muted" : "")}>
                    {value}
                  </span>
                </button>
              ))}
            </div>
            <IconButton
              name="expand16"
              label={expanded ? "Restore overview" : "Expand overview"}
              onClick={() => setExpanded(!expanded)}
            />
          </div>
          <div className="divider" />
          <div className="panel-body">
            <DeviceNavigation
              collapsed={navCollapsed}
              onCollapse={() => setNavCollapsed(!navCollapsed)}
              onInfo={info}
            />
            <div className="dashboard" key={selected}>
              <section className="metrics" aria-label="Key metrics">
                {[
                  ["Views", 7265, "+11.01%"],
                  ["Visits", 3671, "−0.03%"],
                  ["New Users", 156, "+15.03%"],
                  ["Active Users", 2318, "+6.08%"],
                ].map(([label, value, change], i) => (
                  <article className="metric" key={label}>
                    <span>{label}</span>
                    <div className="metric-value">
                      <strong>
                        {Math.round(value * factor).toLocaleString("en-US")}
                      </strong>
                      <span>
                        {change}
                        <Icon name={i === 1 ? "ArrowFall" : "ArrowRise"} />
                      </span>
                    </div>
                  </article>
                ))}
              </section>
              <div className="charts-top">
                <TrendChart factor={factor} />
                <WebsiteTraffic factor={factor} />
                <article className="chart-card">
                  <h3>Traffic by Device</h3>
                  <BarChart
                    labels={[
                      "Linux",
                      "Mac",
                      "iOS",
                      "Windows",
                      "Android",
                      "Other",
                    ]}
                    values={[20, 35, 25, 38, 15, 30].map((v) => v * factor)}
                    colors={[
                      "#a0bce8",
                      "#6be6d3",
                      "#000000",
                      "#7dbbff",
                      "#ba9bed",
                      "#6fdf92",
                    ]}
                  />
                </article>
              </div>
              <div className="charts-bottom">
                <article className="chart-card">
                  <h3>Marketing &amp; SEO</h3>
                  <BarChart
                    labels={[
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ]}
                    values={[
                      20, 35, 25, 38, 15, 30, 20, 35, 25, 40, 15, 30,
                    ].map((v) => v * factor)}
                    colors={[
                      "#9f9ff8",
                      "#96e2d6",
                      "#000000",
                      "#92bfff",
                      "#aec7ed",
                      "#94e9b8",
                    ]}
                  />
                </article>
                <Locations />
              </div>
            </div>
          </div>
        </section>
      </main>
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
      {dialog && (
        <Dialog title={dialog.title} onClose={closeDialog}>
          {dialog.kind === "add" ? (
            <form onSubmit={addDevice}>
              <p>Add a device to this overview.</p>
              <label className="form-label">
                Device name
                <input
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="NGFW-07"
                  maxLength="32"
                  aria-invalid={!!error}
                  aria-describedby={error ? "name-error" : undefined}
                />
              </label>
              {error && (
                <p className="error" id="name-error">
                  {error}
                </p>
              )}
              <div className="dialog-actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={closeDialog}
                >
                  Cancel
                </button>
                <button className="primary" type="submit">
                  Add device
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="dialog-device">
                <Icon name="device-dark" size={24} />
                {selected}
                <span className="status">
                  <img src={asset("Badge")} width="6" height="6" alt="" />
                  Connected
                </span>
              </p>
              <div className="info-row">
                <span>Context</span>
                <strong>{scope}</strong>
              </div>
              {counters.some(([n]) => n === dialog.title) ? (
                <div className="info-row">
                  <span>Total</span>
                  <strong>
                    {counters.find(([n]) => n === dialog.title)[1]}
                  </strong>
                </div>
              ) : (
                <div className="info-row">
                  <span>Section</span>
                  <strong>{dialog.title}</strong>
                </div>
              )}
              <p className="muted-note">Device summary</p>
              <button className="primary" onClick={closeDialog}>
                Back to overview
              </button>
            </>
          )}
        </Dialog>
      )}
    </div>
  );
}
function WebsiteTraffic({ factor }) {
  const [active, setActive] = useState(null);
  return (
    <article className="chart-card websites">
      <h3>Traffic by Website</h3>
      <div className="website-rows">
        {[
          ["Google", 10],
          ["YouTube", 18],
          ["Instagram", 12],
          ["Pinterest", 25],
          ["Facebook", 8],
          ["Twitter", 14],
        ].map(([name, width]) => (
          <button
            key={name}
            className={"website-row " + (active === name ? "chosen" : "")}
            onClick={() => setActive(active === name ? null : name)}
            aria-pressed={active === name}
          >
            <span>{name}</span>
            <span className="website-bars">
              {[1, 2, 3].map((i) => (
                <meter
                  key={i}
                  min="0"
                  max="1"
                  value="1"
                  style={{ width }}
                  className={"segment segment-" + i}
                  aria-label={name + " traffic segment " + i}
                />
              ))}
            </span>
            {active === name && (
              <span className="website-value">
                {Math.round(width * 210 * factor).toLocaleString()} visits
              </span>
            )}
          </button>
        ))}
      </div>
    </article>
  );
}
