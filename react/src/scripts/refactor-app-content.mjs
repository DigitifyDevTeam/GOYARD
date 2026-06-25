import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appPath = path.join(__dirname, "..", "App.tsx");
let content = fs.readFileSync(appPath, "utf8");

function removeBetween(startMarker, endMarker, inclusiveEnd = false) {
  const start = content.indexOf(startMarker);
  if (start === -1) {
    console.warn("Start marker not found:", startMarker.slice(0, 60));
    return;
  }
  const end = content.indexOf(endMarker, start + startMarker.length);
  if (end === -1) {
    console.warn("End marker not found after:", startMarker.slice(0, 60));
    return;
  }
  const removeEnd = inclusiveEnd ? end + endMarker.length : end;
  content = content.slice(0, start) + content.slice(removeEnd);
  console.log("Removed block:", startMarker.slice(0, 50).replace(/\n/g, " "));
}

// --- Remove legacy quote/info/options early-return block ---
removeBetween(
  "  // @legacy-tunnel — /tunnel/devis, /tunnel/info, /tunnel/options (archived routes)",
  "  return (\n    <div className=\"bg-slate-50\">\n      {/* Header */}\n      <header className=\"bg-white border-b border-slate-200\">"
);

// --- Replace quote-confirmation inline UI with DevisConfirmation ---
const confirmationStart = "  // Active: confirmation after Paris LP form submit\n  if (currentPage === \"quote-confirmation\") {";
const confirmationEnd = "  }\n\n";
const confIdx = content.indexOf(confirmationStart);
if (confIdx !== -1) {
  const confEndIdx = content.indexOf(confirmationEnd, confIdx);
  if (confEndIdx !== -1) {
    const replacement =
      "  if (routePath === \"/tunnel/devis/confirmation\") {\n    return <DevisConfirmation />;\n  }\n\n";
    content =
      content.slice(0, confIdx) + replacement + content.slice(confEndIdx + confirmationEnd.length);
    console.log("Replaced quote-confirmation block");
  }
}

// --- Remove legacy form/methods UI ---
removeBetween(
  "              {currentPage === \"form\" && (\n                <h1 className=\"text-xl sm:text-2xl font-semibold text-slate-900 mb-6 sm:mb-8\">\n                  Votre devis de déménagement\n                </h1>\n              )}",
  "              {isParisLpVolumeCalc && !isParisLpVolumeListPage ? ("
);

// Remove mobile progress block
removeBetween(
  "              {/* Mobile progress */}\n              {!isParisLpVolumeCalc ? (",
  "              ) : null}\n\n              {isParisLpVolumeCalc && !isParisLpVolumeListPage ? ("
);

// Remove legacy form step UI
removeBetween(
  "              {/* @legacy-tunnel — step 1 UI: /tunnel/mes-coordonnees */}",
  "              {/* @legacy-tunnel — step 2 UI: /tunnel/choix-volume */}"
);

// Remove legacy methods step UI  
removeBetween(
  "              {currentPage === \"methods\" && (",
  "              {/* Volume liste: active /lp/paris/calcule-volume; @legacy-tunnel /tunnel/mon-volume/liste */}"
);

// Simplify volume list condition - remove Sophie legacy branch and condition wrapper
content = content.replace(
  /              \{\/\* Volume liste: active \/lp\/paris\/calcule-volume; @legacy-tunnel \/tunnel\/mon-volume\/liste \*\/\}\n              \{currentPage === "volume" && selectedMethod === "list" && \(\n                <>\n                  \{!isParisLpVolumeListPage \? \([\s\S]*?\) : null\}\n\n                  \{\/\* Room Navigation \*\/\}/,
  "              {/* Volume liste — /lp/paris/calcule-volume */}\n              <>\n                  {/* Room Navigation */}"
);

// Remove legacy surface/photo/ai/addresses UI after list volume closing
removeBetween(
  "              )}\n\n              {/* @legacy-tunnel — /tunnel/mon-volume/surface */}",
  "            </div>\n          </div>\n\n          {/* Sidebar */}"
);

// Fix list volume closing - remove extra )} from old conditional
content = content.replace(
  /                  <\/div>\n                <\/>\n              \)\}/,
  "                  </div>\n                </>"
);

// Remove legacy sidebar (keep only ParisVolumeCalcSidebar)
content = content.replace(
  /          \{isParisLpVolumeListPage \? \(\n            <ParisVolumeCalcSidebar[\s\S]*?\/>\n          \) : !isParisLpVolumeCalc \? \([\s\S]*?\) : null\}/,
  `          <ParisVolumeCalcSidebar
              roomObjectQuantities={roomObjectQuantities}
              specialObjectQuantities={specialObjectQuantities}
              onReset={resetParisVolumeInventory}
              className="lg:sticky lg:top-6 lg:self-start"
            />`
);

// Remove footer trust badges and footer text legacy blocks
removeBetween(
  "        {/* Footer Trust Badges */}\n        {!isParisLpVolumeCalc ? (",
  "        ) : null}\n      </div>\n    </div>\n  );\n}\n\nfunction shouldUseTrailingSlash"
);

// --- Simplify AppContent header doc and routing ---
content = content.replace(
  /\/\*\*\n \* AppContent — active routes:[\s\S]*?\*\/\nfunction AppContent\(\) \{[\s\S]*?const isParisLpVolumeCalc = routePath === PARIS_LP_VOLUME_CALC_PATH;\n\n  \/\/ Get current page from URL\n  const getCurrentPage = \(\) => \{[\s\S]*?return null;\n  \};\n\n  const currentPage = getCurrentPage\(\);\n\n  \/\/ Update selectedMethod when URL changes and track last used method\n  useEffect\(\(\) => \{[\s\S]*?\}, \[location\.pathname\]\);\n\n  \/\/ Load existing form data on component mount\n  useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);\n\n  \/\/ Pre-fill or clear address when coming from home page[\s\S]*?\}, \[location\.pathname\]\);\n\n/,
  `/**
 * AppContent — active routes only:
 * - /lp/paris/calcule-volume (list-method volume calculator)
 * - /tunnel/devis/confirmation (post-submit success)
 *
 * Legacy multi-step tunnel archived — restore: src/archive/legacy-tunnel/README.md
 */
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const routePath = normalizeRoutePath(location.pathname);

  if (routePath === "/tunnel/devis/confirmation") {
    return <DevisConfirmation />;
  }

`
);

// --- Remove legacy state block and replace with minimal state ---
const stateStart = "  const [propertyValue, setPropertyValue]";
const stateEnd = "  // Set default room for list method";
const sIdx = content.indexOf(stateStart);
const eIdx = content.indexOf(stateEnd);
if (sIdx !== -1 && eIdx !== -1) {
  const minimalState = `  const [selectedRoom, setSelectedRoom] = useState("Entrée");
  const [searchTerm, setSearchTerm] = useState("");
  const [cleaningQuantities, setCleaningQuantities] = useState<
    Record<string, number>
  >({});
  const [roomObjectQuantities, setRoomObjectQuantities] = useState<
    Record<string, Record<string, number>>
  >({});
  const [hasSpecialObjects, setHasSpecialObjects] = useState(false);
  const [specialObjectQuantities, setSpecialObjectQuantities] = useState<Record<string, number>>({});
  const [customRooms, setCustomRooms] = useState<string[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [showAddPieceForm, setShowAddPieceForm] = useState(false);
  const [showAddHeavyObjectForm, setShowAddHeavyObjectForm] = useState(false);
  const [pieceForm, setPieceForm] = useState({
    nature: "",
    quantite: "",
    longueur: "",
    largeur: "",
    hauteur: ""
  });
  const [heavyObjectForm, setHeavyObjectForm] = useState({
    nature: "",
    quantite: "",
    longueur: "",
    largeur: "",
    hauteur: ""
  });
  const [customObjectDetails, setCustomObjectDetails] = useState<Record<string, {
    name: string;
    quantity: number;
    length: number;
    width: number;
    height: number;
  }>>({});
  const [customHeavyObjectDetails, setCustomHeavyObjectDetails] = useState<Record<string, {
    name: string;
    quantity: number;
    length: number;
    width: number;
    height: number;
  }>>({});

  `;
  content = content.slice(0, sIdx) + minimalState + content.slice(eIdx);
  console.log("Replaced state block");
}

// Remove handleInputChange and legacy handlers through handleSendDevis
removeBetween(
  "  const handleInputChange = (field: string, value: string) => {",
  "  const toggleOption = (optionKey: keyof typeof options) => {"
);
removeBetween(
  "  const toggleOption = (optionKey: keyof typeof options) => {",
  "  const updateAddressData = ("
);
removeBetween(
  "  const updateAddressData = (",
  "  const updateQuantity = (item: string, change: number) => {"
);
removeBetween(
  "  const addEscale = () => {",
  "  const updateQuantity = (item: string, change: number) => {"
);

// Remove wasParisCalcRef effect - simplify cleanup
content = content.replace(
  /  const wasParisCalcRef = useRef\(isParisLpVolumeCalc\);\n  useEffect\(\(\) => \{[\s\S]*?\}, \[isParisLpVolumeCalc\]\);\n\n/,
  ""
);

// Simplify clearParisVolumeInventoryState - remove customHeavyObjects reset if we keep the state
content = content.replace(
  /    setCustomHeavyObjects\(\[\]\);\n/,
  ""
);

// Remove AI/superficie heavy object handlers
removeBetween(
  "  // AI method heavy object handlers\n  const handleAddAiHeavyObject",
  "  const removeSuperficieCustomHeavyObject = (objectName: string) => {"
);
removeBetween(
  "  const removeSuperficieCustomHeavyObject = (objectName: string) => {",
  "  // Check if user has either uploaded images or added special objects\n  const canContinueAI"
);
removeBetween(
  "  // Check if user has either uploaded images or added special objects\n  const canContinueAI = () => {",
  "  const _dateOptions = ["
);
removeBetween(
  "  const _dateOptions = [",
  "  if (routePath === \"/tunnel/devis/confirmation\") {"
);

// Remove getRoomIcon and AI-only special object lists
content = content.replace(
  /  \/\/ Room icons mapping for AI method\n  const getRoomIcon[\s\S]*?return roomIcons\[room\] \|\| <Package className="w-6 h-6" \/>;\n  \};\n\n/,
  ""
);
content = content.replace(
  /  \/\/ Custom heavy objects added by user \(for AI method\)\n  const \[aiCustomHeavyObjects[\s\S]*?const superficieSpecialObjects = \[\.\.\.predefinedSpecialObjects, \.\.\.superficieCustomHeavyObjects\];\n\n/,
  ""
);
content = content.replace(
  /  const handleAddCustomRoom[\s\S]*?  \};\n\n  const handleRemoveCustomRoom[\s\S]*?  \};\n\n/,
  ""
);

// Simplify submitManualSelection - remove legacy branch
content = content.replace(
  /      if \(isParisLpVolumeCalc\) \{/,
  "      {"
);
content = content.replace(
  /\n      if \(!clientId\) \{[\s\S]*?navigate\("\/tunnel\/adresses"\);\n      \} else \{[\s\S]*?\n    \} catch/,
  "\n    } catch"
);

// Simplify heavy objects in submitManualSelection
content = content.replace(
  /            const isCustomHeavyObject = customHeavyObjects\.includes\(object\);\n            const isAiCustomHeavyObject = aiCustomHeavyObjects\.includes\(object\);\n            const isSuperficieCustomHeavyObject = superficieCustomHeavyObjects\.includes\(object\);\n\n            if \(isCustomHeavyObject \|\| isAiCustomHeavyObject \|\| isSuperficieCustomHeavyObject\) \{/,
  "            const isCustomHeavyObject = customHeavyObjects.includes(object);\n\n            if (isCustomHeavyObject) {"
);
content = content.replace(
  /              const customHeavyDetails = customHeavyObjectDetails\[object\] \|\| aiCustomHeavyObjectDetails\[object\] \|\| superficieCustomHeavyObjectDetails\[object\];/,
  "              const customHeavyDetails = customHeavyObjectDetails[object];"
);

// Simplify handleBackToMethods
content = content.replace(
  /  const handleBackToMethods = \(\) => \{\n    if \(isParisLpVolumeCalc\) \{\n      navigate\(PARIS_LP_PATH\);\n      return;\n    \}\n    navigate\("\/tunnel\/choix-volume"\);\n  \};/,
  "  const handleBackToMethods = () => {\n    navigate(PARIS_LP_PATH);\n  };"
);

// Remove duplicate confirmation check if script left one
content = content.replace(
  /\n  if \(routePath === "\/tunnel\/devis\/confirmation"\) \{\n    return <DevisConfirmation \/>;\n  \}\n\n  if \(routePath === "\/tunnel\/devis\/confirmation"\) \{\n    return <DevisConfirmation \/>;\n  \}\n/,
  "\n  if (routePath === \"/tunnel/devis/confirmation\") {\n    return <DevisConfirmation />;\n  }\n"
);

// Simplify render - remove isParisLpVolumeCalc conditionals
content = content.replace(
  /isParisLpVolumeListPage/g,
  "true"
);
content = content.replace(
  /isParisLpVolumeCalc/g,
  "true"
);
content = content.replace(
  /\{true \? <ParisVolumeCalcHowItWorks className="mb-8" \/> : null\}/,
  "<ParisVolumeCalcHowItWorks className=\"mb-8\" />"
);
content = content.replace(
  /className=\{cn\(\n            "grid gap-6 lg:gap-8 xl:gap-10",\n            true\n              \? "lg:grid-cols-\[minmax\(0,1fr\)_380px\] xl:grid-cols-\[minmax\(0,1fr\)_420px\]"\n              : true\n                \? "lg:grid-cols-1"\n                : "lg:grid-cols-3",\n          \)\}/,
  'className="grid gap-6 lg:gap-8 xl:gap-10 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]"'
);
content = content.replace(
  /<div className=\{cn\("min-w-0", !true && !true && "lg:col-span-2"\)\}>/,
  '<div className="min-w-0">'
);
content = content.replace(
  /\{true && !true \? \([\s\S]*?\) : null\}/,
  ""
);
content = content.replace(
  /\{true \? \(\n                <h1 className="sr-only">Calculer mon volume automatiquement<\/h1>\n              \) : null\}/,
  '<h1 className="sr-only">Calculer mon volume automatiquement</h1>'
);
content = content.replace(
  /\{true \? "RETOUR AU DEVIS" : "RETOUR"\}/,
  '"RETOUR AU DEVIS"'
);
content = content.replace(
  /\{true \? "VALIDER MON VOLUME →" : "CONTINUER →"\}/,
  '"VALIDER MON VOLUME →"'
);
content = content.replace(
  /"max-w-\[1280px\]",\n        \)\}/,
  '"max-w-[1280px]",\n        )}'
);

// Add DevisConfirmation import
if (!content.includes("DevisConfirmation")) {
  content = content.replace(
    'import NotFound from "./pages/NotFound";',
    'import NotFound from "./pages/NotFound";\nimport DevisConfirmation from "./pages/DevisConfirmation";'
  );
} else if (!content.includes('import DevisConfirmation')) {
  content = content.replace(
    'import NotFound from "./pages/NotFound";',
    'import NotFound from "./pages/NotFound";\nimport DevisConfirmation from "./pages/DevisConfirmation";'
  );
}

// Remove TUNNEL_SUPPORT_PHONE constants if only used in removed blocks - keep for volume calc header
// Remove unused getLocalDateString/clampToTodayOrLater if no longer used
if (!content.includes("getLocalDateString")) {
  content = content.replace(
    /\/\*\* YYYY-MM-DD[\s\S]*?function clampToTodayOrLater[\s\S]*?\}\n\n/,
    ""
  );
}

fs.writeFileSync(appPath, content);
console.log("Refactor complete. Lines:", content.split("\n").length);
