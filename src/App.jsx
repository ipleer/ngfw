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
const interfaceColumns = [
  "Name",
  "Admin state",
  "State",
  "Type",
  "VLAN ID",
  "LAG interface",
  "Virtual context",
  "Mode",
];
const initialInterfaceRows = [
  { id: "ae1", name: "ae1", group: true, state: "Pending", type: "LAG interface", detail: "2 interfaces" },
  { id: "ae1.0", name: "ae1.0", parent: "ae1", admin: "Enabled", state: "Pending", type: "Subinterface", vlan: "Untagged", context: "Default", mode: "Routing" },
  { id: "ae1.1", name: "ae1.1", parent: "ae1", admin: "Enabled", state: "Pending", type: "Subinterface", vlan: "1", context: "Default", mode: "Routing" },
  { id: "eth1-1", name: "eth1-1", group: true, state: "Pending", type: "Interface" },
  { id: "eth1-1.0", name: "eth1-1.0", parent: "eth1-1", admin: "Enabled", state: "Pending", type: "Subinterface", vlan: "Untagged", context: "Default", mode: "Routing" },
  { id: "eth1-1.1", name: "eth1-1.1", parent: "eth1-1", admin: "Enabled", state: "Pending", type: "Subinterface", vlan: "1", context: "Default", mode: "Routing" },
  { id: "eth1-1.2", name: "eth1-1.2", parent: "eth1-1", admin: "Enabled", state: "Pending", type: "Subinterface", vlan: "2", context: "Default", mode: "Decryption" },
  { id: "eth1-1.3", name: "eth1-1.3", parent: "eth1-1", admin: "Enabled", state: "Unavailable", type: "Subinterface", vlan: "3", context: "Default", mode: "vWire" },
  { id: "eth1-2", name: "eth1-2", group: true, state: "Up", type: "LAG member" },
  { id: "eth2-1", name: "eth2-1", group: true, state: "Pending", type: "LAG member" },
  { id: "eth2-2", name: "eth2-2", group: true, state: "Pending", type: "Interface" },
  { id: "eth2-2.0", name: "eth2-2.0", parent: "eth2-2", admin: "Enabled", state: "Pending", type: "Subinterface", vlan: "Untagged", context: "Default", mode: "Routing" },
  { id: "eth2-2.1", name: "eth2-2.1", parent: "eth2-2", admin: "Enabled", state: "Pending", type: "Subinterface", vlan: "1", context: "Default", mode: "Routing" },
  { id: "tunnels", name: "Tunnel interfaces", group: true, type: "Tunnel" },
  { id: "tunnel-1", name: "Tunnel interface 1", parent: "tunnels", admin: "Enabled", type: "GRE", mode: "Routing" },
  { id: "tunnel-2", name: "Tunnel interface 2", parent: "tunnels", admin: "Enabled", state: "Off", type: "IPsec Site-to-Site", mode: "Routing" },
];
function getInterfaceRows(device) {
  if (device === "NGFW-02") return initialInterfaceRows;
  if (device.startsWith("Cluster")) {
    return [
      { id: "cluster-bond", name: "ae2", group: true, state: "Up", type: "LAG interface", detail: "3 interfaces" },
      { id: "cluster-bond-0", name: "ae2.10", parent: "cluster-bond", admin: "Enabled", state: "Up", type: "Subinterface", vlan: "10", context: "Default", mode: "Routing" },
      { id: "cluster-bond-1", name: "ae2.20", parent: "cluster-bond", admin: "Enabled", state: "Up", type: "Subinterface", vlan: "20", context: "Default", mode: "Routing" },
      { id: "cluster-bond-2", name: "ae2.99", parent: "cluster-bond", admin: "Enabled", state: "Pending", type: "Subinterface", vlan: "99", context: "Management", mode: "Routing" },
      { id: "cluster-ha", name: "eth2-1", group: true, state: "Up", type: "Cluster link", detail: "2 interfaces" },
      { id: "cluster-ha-1", name: "eth2-1.0", parent: "cluster-ha", admin: "Enabled", state: "Up", type: "Heartbeat", mode: "Cluster" },
      { id: "cluster-ha-2", name: "eth2-1.1", parent: "cluster-ha", admin: "Enabled", state: "Up", type: "Synchronization", mode: "Cluster" },
      { id: "cluster-mgmt", name: "eth2-2", group: true, state: "Pending", type: "Management" },
      { id: "cluster-tunnels", name: "Tunnel interfaces", group: true, type: "Tunnel" },
      { id: "cluster-gre", name: "gre-cluster-2-1", parent: "cluster-tunnels", admin: "Enabled", state: "Up", type: "GRE", mode: "Routing" },
      { id: "cluster-ipsec", name: "ipsec-branch-2", parent: "cluster-tunnels", admin: "Enabled", state: "Off", type: "IPsec Site-to-Site", mode: "Routing" },
    ];
  }
  const number = Number(device.match(/\d+/)?.[0] || 1);
  const lagId = `ae-${number}`;
  const ethernetId = `ethernet-${number}`;
  const uplinkId = `uplink-${number}`;
  const tunnelId = `tunnels-${number}`;
  const ethernetChildren = Array.from({ length: 1 + (number % 3) }, (_, index) => ({
    id: `${ethernetId}-${index}`,
    name: `eth${number}-1.${index}`,
    parent: ethernetId,
    admin: "Enabled",
    state: index === number % 3 ? "Unavailable" : number % 2 ? "Up" : "Pending",
    type: "Subinterface",
    vlan: index === 0 ? "Untagged" : String(number * 10 + index),
    context: index === 2 ? `Tenant-${number}` : "Default",
    mode: index === 2 ? "Decryption" : "Routing",
  }));
  return [
    { id: lagId, name: `ae${number}`, group: true, state: number % 2 ? "Up" : "Pending", type: "LAG interface", detail: `${number % 2 ? 3 : 2} interfaces` },
    { id: `${lagId}-0`, name: `ae${number}.0`, parent: lagId, admin: "Enabled", state: number % 2 ? "Up" : "Pending", type: "Subinterface", vlan: "Untagged", context: "Default", mode: "Routing" },
    ...(number % 2 ? [{ id: `${lagId}-1`, name: `ae${number}.100`, parent: lagId, admin: "Enabled", state: "Pending", type: "Subinterface", vlan: String(number * 100), context: `Tenant-${number}`, mode: "Routing" }] : []),
    { id: ethernetId, name: `eth${number}-1`, group: true, state: number === 5 ? "Unavailable" : "Pending", type: "Interface" },
    ...ethernetChildren,
    { id: uplinkId, name: `eth${number}-2`, group: true, state: number % 2 ? "Up" : "Pending", type: number % 2 ? "LAG member" : "Interface" },
    { id: `${uplinkId}-0`, name: `eth${number}-2.0`, parent: uplinkId, admin: number === 6 ? "Off" : "Enabled", state: number === 6 ? "Off" : "Up", type: "Subinterface", vlan: String(200 + number), context: "Default", mode: number === 4 ? "vWire" : "Routing" },
    { id: tunnelId, name: "Tunnel interfaces", group: true, type: "Tunnel" },
    { id: `${tunnelId}-gre`, name: `gre-${device.toLowerCase()}`, parent: tunnelId, admin: "Enabled", state: number % 2 ? "Up" : "Pending", type: "GRE", mode: "Routing" },
    ...(number > 3 ? [{ id: `${tunnelId}-ipsec`, name: `ipsec-branch-${number}`, parent: tunnelId, admin: "Enabled", state: number === 6 ? "Unavailable" : "Off", type: "IPsec Site-to-Site", mode: "Routing" }] : []),
  ];
}
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
function DeviceNavigation({ collapsed, onCollapse, onInfo, active, onNavigate }) {
  const [closed, setClosed] = useState(() =>
    Object.fromEntries(
      groups.filter((group) => group.children).map((group) => [group.name, true]),
    ),
  );
  return (
    <nav
      className={"device-nav " + (collapsed ? "narrow" : "")}
      aria-label="Device navigation"
    >
      <div className={"nav-summary " + (active === "Summary" ? "active" : "")}>
        <button onClick={() => onNavigate("Summary")} aria-current={active === "Summary" ? "page" : undefined}>
          <Icon name="zone16" />
          {!collapsed && "Summary"}
        </button>
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
                  className={"nav-row " + (active === g.name ? "active" : "")}
                  onClick={() =>
                    g.children
                      ? setClosed({ ...closed, [g.name]: !closed[g.name] })
                      : g.name === "Interfaces"
                        ? onNavigate("Interfaces")
                        : onInfo(g.name)
                  }
                  aria-current={active === g.name ? "page" : undefined}
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

function StatusBadge({ value }) {
  if (!value) return null;
  const tone = value === "Enabled" || value === "Up" ? "success" : value === "Unavailable" ? "danger" : value === "Pending" ? "warning" : "neutral";
  return <span className={"state-badge " + tone}><span aria-hidden="true" />{value}</span>;
}

function InterfacesScreen({ device, search, onSearch, onAction, onExpand }) {
  const [activeTab, setActiveTab] = useState("Section 1");
  const [collapsed, setCollapsed] = useState({});
  useEffect(() => setCollapsed({}), [device]);
  const interfaceRows = getInterfaceRows(device);
  const parentIds = new Set(
    interfaceRows.filter((row) => row.parent).map((row) => row.parent),
  );
  const visibleRows = interfaceRows.filter((row) => {
    if (row.parent && collapsed[row.parent]) return false;
    return !search || row.name.toLowerCase().includes(search.toLowerCase()) || row.parent?.toLowerCase().includes(search.toLowerCase());
  });
  return (
    <div className="interfaces-screen">
      <div className="interface-tabs" role="tablist" aria-label="Interface sections">
        {["Section 1", "Section 2", "Section 3", "Section 4", "Section 5"].map((tab) => (
          <button key={tab} role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>
      <div className="interface-actions">
        <button className="interface-add" onClick={() => onAction("Add interface")}><Icon name="plus16" />Add</button>
        <span className="action-separator" />
        {["{Label}", "{Label}", "{Label}"].map((label, index) => (
          <button className="interface-secondary" key={index} onClick={() => onAction(label)}><Icon name="plus16" />{label}</button>
        ))}
        <div className="interface-tools">
          <IconButton name="FilterIcon" label="Filter interfaces" onClick={() => onAction("Filter interfaces")} />
          <IconButton name="search" label="Search interfaces" onClick={() => document.getElementById("interface-search")?.focus()} />
          <label className="interface-search">
            <Icon name="search" />
            <input id="interface-search" aria-label="Search interfaces" placeholder="Search" value={search} onChange={(event) => onSearch(event.target.value)} />
          </label>
          <span className="action-separator" />
          <IconButton name="expand16" label="Expand table" onClick={onExpand} />
          <IconButton name="settings16" label="Table settings" onClick={() => onAction("Table settings")} />
          <IconButton name="Menu_new" label="Table columns" onClick={() => onAction("Table columns")} />
        </div>
      </div>
      <div className="interfaces-table-scroll">
        <div className="interfaces-table" role="table" aria-label="Interfaces">
          <div className="interfaces-head" role="row">
            {interfaceColumns.map((column) => <span role="columnheader" key={column}>{column}</span>)}
          </div>
          <div role="rowgroup">
            {visibleRows.map((row) => (
              <div className={"interface-row " + (row.parent ? "child" : "group")} role="row" key={row.id}>
                <span className="interface-name" role="cell">
                  {row.group && parentIds.has(row.id) ? (
                    <button aria-label={(collapsed[row.id] ? "Expand " : "Collapse ") + row.name} aria-expanded={!collapsed[row.id]} onClick={() => setCollapsed({ ...collapsed, [row.id]: !collapsed[row.id] })}>
                      <Icon name="chevronDown16" className={collapsed[row.id] ? "rotated" : ""} />
                    </button>
                  ) : <span className="interface-indent" />}
                  <Icon name="interface16" />
                  <strong>{row.name}</strong>
                </span>
                <span role="cell"><StatusBadge value={row.admin} /></span>
                <span role="cell"><StatusBadge value={row.state} /></span>
                <span className="interface-type" role="cell"><span>{row.type}</span>{row.detail && <small>{row.detail}</small>}</span>
                <span role="cell">{row.vlan}</span>
                <span role="cell">{row.lag}</span>
                <span role="cell">{row.context && <span className="virtual-context"><Icon name="hierarhy" />{row.context}</span>}</span>
                <span role="cell">{row.mode}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
  const [currentSection, setCurrentSection] = useState(() =>
      window.location.hash === "#interfaces" ? "Interfaces" : "Summary",
    ),
    [interfaceSearch, setInterfaceSearch] = useState("");
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
    Math.max(240, (workspaceRef.current?.clientWidth ?? viewportWidth) - 496);
  const navigateTo = (section) => {
    setCurrentSection(section);
    window.history.replaceState(null, "", section === "Interfaces" ? "#interfaces" : window.location.pathname + window.location.search);
  };
  useEffect(() => {
    function syncSection() {
      setCurrentSection(window.location.hash === "#interfaces" ? "Interfaces" : "Summary");
    }
    window.addEventListener("hashchange", syncSection);
    return () => window.removeEventListener("hashchange", syncSection);
  }, []);
  useEffect(() => {
    document.title = currentSection === "Interfaces" ? "TT NGFW — Interfaces" : "TT NGFW — Device Overview";
  }, [currentSection]);
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
      const max = Math.max(240, rect.width - 496);
      setDevicePaneWidth(Math.min(max, Math.max(240, e.clientX - rect.left)));
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
    setDevicePaneWidth((width) => Math.min(max, Math.max(240, width + delta)));
  };
  const factor =
    selected === "NGFW-02"
      ? 1
      : 0.74 + (Math.max(0, devices.indexOf(selected) - 2) + 1) * 0.08;
  const info = (name) => setDialog({ kind: "info", title: name });
  const selectDevice = (name) => {
    setSelected(name);
    setInterfaceSearch("");
  };
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
                            onClick={() => selectDevice(n)}
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
                      onClick={() => selectDevice(n)}
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
              aria-valuemin="240"
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
                else if (e.key === "Home") setDevicePaneWidth(240);
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
          aria-label={selected + " " + currentSection.toLowerCase()}
        >
          <div className={"panel-header " + (currentSection === "Interfaces" ? "interface-header" : "")}>
            {currentSection === "Interfaces" ? (
              <div className="interface-heading">
                <IconButton name="chevronDown16" className="back-icon" label="Back to summary" onClick={() => navigateTo("Summary")} />
                <span className="heading-separator" />
                <div className="device-title muted-device">
                  <h2><Icon name="device-dark" size={24} />{selected}</h2>
                  <span className="status"><img src={asset("Badge")} width="6" height="6" alt="" />Connected</span>
                </div>
                <Icon name="chevronDown16" className="forward-icon" />
                <div className="section-title">
                  <h2><Icon name="interface16" size={24} />Interfaces</h2>
                  <span>xsaxsxs</span>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
            <IconButton
              name="expand16"
              label={expanded ? "Restore panel" : "Expand panel"}
              onClick={() => setExpanded(!expanded)}
            />
          </div>
          <div className="divider" />
          <div className="panel-body">
            <DeviceNavigation
              collapsed={navCollapsed}
              onCollapse={() => setNavCollapsed(!navCollapsed)}
              onInfo={info}
              active={currentSection}
              onNavigate={navigateTo}
            />
            {currentSection === "Interfaces" ? (
              <InterfacesScreen device={selected} search={interfaceSearch} onSearch={setInterfaceSearch} onAction={(action) => setToast(action)} onExpand={() => setExpanded(true)} />
            ) : <div className="dashboard" key={selected}>
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
            </div>}
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
