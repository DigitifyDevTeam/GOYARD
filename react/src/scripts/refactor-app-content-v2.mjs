import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appPath = path.join(__dirname, "..", "App.tsx");
let content = fs.readFileSync(appPath, "utf8");

function removeBlock(start, end) {
  const s = content.indexOf(start);
  if (s === -1) {
    console.warn("MISS start:", JSON.stringify(start.slice(0, 80)));
    return false;
  }
  const e = content.indexOf(end, s + start.length);
  if (e === -1) {
    console.warn("MISS end after:", JSON.stringify(start.slice(0, 80)));
    return false;
  }
  content = content.slice(0, s) + content.slice(e);
  console.log("OK removed:", start.slice(0, 55).replace(/\n/g, " "));
  return true;
}

// --- Import DevisConfirmation ---
if (!content.includes('import DevisConfirmation from "./pages/DevisConfirmation"')) {
  content = content.replace(
    'import NotFound from "./pages/NotFound";',
    'import NotFound from "./pages/NotFound";\nimport DevisConfirmation from "./pages/DevisConfirmation";'
  );
}

// --- AppContent doc + early routing ---
content = content.replace(
  `/**
 * AppContent — active routes: /lp/paris/calcule-volume, /tunnel/devis/confirmation.
 *
 * @legacy-tunnel Multi-step tunnel UI below is archived (routes → /lp/paris).
 * Restore guide: src/archive/legacy-tunnel/README.md
 */
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const routePath = normalizeRoutePath(location.pathname);
  const isParisLpVolumeCalc = routePath === PARIS_LP_VOLUME_CALC_PATH;

  // Get current page from URL
  const getCurrentPage = () => {
    const path = routePath;
    if (path === "/lp/paris") return "form";
    if (path === "/tunnel/choix-volume") return "methods";
    if (path === PARIS_LP_VOLUME_CALC_PATH) return "volume";
    if (path === "/tunnel/mon-volume/liste") return "volume";
    if (path === "/tunnel/mon-volume/ai") return "volume";
    if (path === "/tunnel/mon-volume/surface") return "volume";
    if (path === "/tunnel/ai-results") return "ai-results";
    if (path === "/tunnel/adresses") return "addresses";
    if (path === "/tunnel/devis") return "quote";
    if (path === "/tunnel/devis/confirmation") return "quote-confirmation";
    if (path === "/tunnel/info") return "info";
    if (path === "/tunnel/options") return "options";
    return "form";
  };

  const getSelectedMethodFromUrl = () => {
    const path = routePath;
    if (path === PARIS_LP_VOLUME_CALC_PATH) return "list";
    if (path === "/tunnel/mon-volume/liste") return "list";
    if (path === "/tunnel/mon-volume/ai") return "photo";
    if (path === "/tunnel/mon-volume/surface") return "surface";
    return null;
  };

  const currentPage = getCurrentPage();

  // Update selectedMethod when URL changes and track last used method
  useEffect(() => {
    const methodFromUrl = getSelectedMethodFromUrl();
    if (methodFromUrl) {
      setSelectedMethod(methodFromUrl);
      setLastUsedMethod(methodFromUrl);
    }
  }, [location.pathname]);

  // Load existing form data on component mount
  useEffect(() => {
    const existingData = FormDataManager.getFormData();
    const resolvedLastName = (existingData.lastName ?? existingData.name ?? "") as string;
    if (existingData.firstName || resolvedLastName || existingData.email || existingData.phone) {
      setFormData(prev => ({
        ...prev,
        firstName: existingData.firstName || '',
        name: resolvedLastName || '',
        email: existingData.email || '',
        phone: existingData.phone || '',
        address: existingData.address || '',
        date: clampToTodayOrLater((existingData.date as string) || prev.date)
      }));
      // Sync saved address into addressData so "Au départ" is pre-filled on tunnel/adresses
      const savedAddress = existingData.address?.trim();
      if (savedAddress) {
        setAddressData(prev => ({
          ...prev,
          departure: { ...prev.departure, address: savedAddress },
        }));
      }
    }

    // Check if user has already submitted form (has clientId)
    const storedClientId = localStorage.getItem('clientId');
    if (storedClientId) {
      setClientId(parseInt(storedClientId));
    }
  }, []);

  // Pre-fill or clear address when coming from home page (obtenir un devis gratuit)
  useEffect(() => {
    if (location.pathname !== "/lp/paris") return;
    const cameFromHome = sessionStorage.getItem("cameFromHome");
    const homeAddress = sessionStorage.getItem("homeDepartureAddress");
    const homeFirstName = sessionStorage.getItem("homeFirstName");
    const homeLastName = sessionStorage.getItem("homeLastName");
    const homeEmail = sessionStorage.getItem("homeEmail");
    const homePhone = sessionStorage.getItem("homePhone");
    const homeMoveDate = sessionStorage.getItem("homeMoveDate");
    sessionStorage.removeItem("cameFromHome");
    sessionStorage.removeItem("homeDepartureAddress");
    sessionStorage.removeItem("homeFirstName");
    sessionStorage.removeItem("homeLastName");
    sessionStorage.removeItem("homeEmail");
    sessionStorage.removeItem("homePhone");
    sessionStorage.removeItem("homeMoveDate");

    if (cameFromHome) {
      if (homeFirstName && homeFirstName.trim()) {
        setFormData(prev => ({ ...prev, firstName: homeFirstName.trim() }));
        FormDataManager.saveFormData({ firstName: homeFirstName.trim() });
      }
      if (homeLastName && homeLastName.trim()) {
        setFormData(prev => ({ ...prev, name: homeLastName.trim() }));
        FormDataManager.saveFormData({ lastName: homeLastName.trim(), name: homeLastName.trim() });
      }
      if (homeEmail && homeEmail.trim()) {
        setFormData(prev => ({ ...prev, email: homeEmail.trim() }));
        FormDataManager.saveFormData({ email: homeEmail.trim() });
      }
      if (homePhone && homePhone.trim()) {
        setFormData(prev => ({ ...prev, phone: homePhone.trim() }));
        FormDataManager.saveFormData({ phone: homePhone.trim() });
      }
      if (homeMoveDate && homeMoveDate.trim()) {
        const date = clampToTodayOrLater(homeMoveDate.trim());
        setFormData(prev => ({ ...prev, date }));
        FormDataManager.saveFormData({ date });
      }
      if (homeAddress && homeAddress.trim()) {
        setFormData(prev => ({ ...prev, address: homeAddress.trim() }));
        setAddressData(prev => ({
          ...prev,
          departure: { ...prev.departure, address: homeAddress.trim() },
        }));
        FormDataManager.saveFormData({ address: homeAddress.trim() });
      } else {
        setFormData(prev => ({ ...prev, address: "" }));
        setAddressData(prev => ({
          ...prev,
          departure: { ...prev.departure, address: "" },
        }));
        FormDataManager.saveFormData({ address: "" });
      }
    }
  }, [location.pathname]);

  const [propertyValue, setPropertyValue]`,
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

  const [selectedRoom, setSelectedRoom]`
);

// Remove orphaned state between mistaken merge - find and remove from setPropertyValue through selectedRoom duplicate
content = content.replace(
  /const \[selectedRoom, setSelectedRoom\] = useState\(""\);\n  const \[searchTerm[\s\S]*?const \[selectedRoom, setSelectedRoom\] = useState\(""\);/,
  'const [selectedRoom, setSelectedRoom] = useState("Entrée");\n  const [searchTerm'
);

// If duplicate still exists, remove propertyValue block
removeBlock("  const [propertyValue, setPropertyValue]", "  const [selectedRoom, setSelectedRoom]");

// Clean up routing leftovers if any
content = content.replace(
  /  const isParisLpVolumeCalc = routePath === PARIS_LP_VOLUME_CALC_PATH;\n\n  \/\/ Get current page[\s\S]*?}, \[location\.pathname\]\);\n\n/g,
  ""
);

// Remove legacy-only state variables (keep list volume state)
const legacyStatePatterns = [
  /  const \[propertyValue, setPropertyValue\][\s\S]*?  const \[selectedRoom, setSelectedRoom\] = useState\(""\);\n/,
];
for (const p of legacyStatePatterns) {
  content = content.replace(p, '  const [selectedRoom, setSelectedRoom] = useState("Entrée");\n');
}

// Remove selectedMethod, step tracking, declared volume, AI state, address state blocks
removeBlock('  const [surfaceArea, setSurfaceArea]', '  // Set default room for list method');
content = content.replace(
  /  const \[selectedMethod, setSelectedMethod\][\s\S]*?  const \[lastUsedMethod, setLastUsedMethod\][\s\S]*?  const currentStepNumber[\s\S]*?  \] as const;\n/,
  ""
);
content = content.replace(
  /  const \[declaredVolumeM3, setDeclaredVolumeM3\][\s\S]*?  const \[customHeavyObjectDetails, setCustomHeavyObjectDetails\][\s\S]*?  \}\>\(\{\}\);\n\n  \/\/ Store AI method[\s\S]*?  \}\>\(\{\}\);\n\n  \/\/ Store superficie method[\s\S]*?  \}\>\(\{\}\);\n\n  const \[addressData, setAddressData\][\s\S]*?  \}\>\(\[\]\);\n\n/,
  ""
);

// Fix default room effect
content = content.replace(
  `  // Set default room for list method
  useEffect(() => {
    if (selectedMethod === "list" && !selectedRoom) {
      setSelectedRoom("Entrée");
    }
  }, [selectedMethod, selectedRoom]);`,
  `  useEffect(() => {
    if (!selectedRoom) {
      setSelectedRoom("Entrée");
    }
  }, [selectedRoom]);`
);

// Remove legacy handlers
removeBlock("  const handleInputChange = (field: string, value: string)", "  const updateQuantity = (item: string, change: number)");
removeBlock("  // @legacy-tunnel — step 1:", "  const handleBackToMethods = () => {");
removeBlock("  const handleBackToMethods = () => {", "  const _handlePreviousRoom = () => {");
removeBlock("  const _handlePreviousRoom = () => {", "  // API functions for manual selection method");

// Simplify submitManualSelection - remove legacy branch after Paris return
content = content.replace(
  /        return;\n      \}\n\n      if \(!clientId\) \{[\s\S]*?navigate\("\/tunnel\/adresses"\);\n      \} else \{[\s\S]*?alert\('Erreur lors de l\\'envoi de la sélection'\);\n    \}/,
  `        return;
      }
    } catch (error) {
      console.error('Error submitting manual selection:', error);
      alert('Erreur lors de l\\'envoi de la sélection');
    }`
);

// Simplify heavy object check in submitManualSelection
content = content.replace(
  /            const isCustomHeavyObject = customHeavyObjects\.includes\(object\);\n            const isAiCustomHeavyObject = aiCustomHeavyObjects\.includes\(object\);\n            const isSuperficieCustomHeavyObject = superficieCustomHeavyObjects\.includes\(object\);\n\n            if \(isCustomHeavyObject \|\| isAiCustomHeavyObject \|\| isSuperficieCustomHeavyObject\) \{/,
  "            const isCustomHeavyObject = customHeavyObjects.includes(object);\n\n            if (isCustomHeavyObject) {"
);
content = content.replace(
  /              const customHeavyDetails = customHeavyObjectDetails\[object\] \|\| aiCustomHeavyObjectDetails\[object\] \|\| superficieCustomHeavyObjectDetails\[object\];/,
  "              const customHeavyDetails = customHeavyObjectDetails[object];"
);

// Remove isParisLpVolumeCalc wrapper in submit - always Paris path
content = content.replace(
  /      if \(isParisLpVolumeCalc\) \{\n        const response = await fetch/,
  "      const response = await fetch"
);
content = content.replace(
  /        \} else \{\n          alert\(result\?\.message \|\| 'Erreur lors du calcul du volume\.'\);\n        \}\n        return;\n      \}/,
  `        } else {
          alert(result?.message || 'Erreur lors du calcul du volume.');
        }`
);

// Add handleBackToMethods after submitManualSelection if removed
if (!content.includes("const handleBackToMethods")) {
  content = content.replace(
    "  const updateRoomObjectQuantity = (roomId: string, object: string, change: number) => {",
    `  const handleBackToMethods = () => {
    navigate(PARIS_LP_PATH);
  };

  const updateRoomObjectQuantity = (roomId: string, object: string, change: number) => {`
  );
} else {
  content = content.replace(
    /  const handleBackToMethods = \(\) => \{[\s\S]*?\};/,
    `  const handleBackToMethods = () => {
    navigate(PARIS_LP_PATH);
  };`
  );
}

// Remove remaining legacy handlers after submitManualSelection
removeBlock("  const updateRoomObjectQuantity = (roomId: string", "  const toggleOption = (optionKey:");
removeBlock("  const toggleOption = (optionKey:", "  const updateQuantity = (item: string, change: number)");
removeBlock("  const updateAddressData = (", "  const updateQuantity = (item: string, change: number)");
removeBlock("  const addEscale = () => {", "  const updateQuantity = (item: string, change: number)");

// Remove wasParisCalcRef - not needed when only Paris route
content = content.replace(
  /  const wasParisCalcRef = useRef\(isParisLpVolumeCalc\);\n  useEffect\(\(\) => \{[\s\S]*?\}, \[isParisLpVolumeCalc\]\);\n\n/,
  ""
);

// Remove AI room icon, AI heavy object state
content = content.replace(
  /  \/\/ Room icons mapping for AI method\n  const getRoomIcon[\s\S]*?return roomIcons\[room\] \|\| <Package className="w-6 h-6" \/>;\n  \};\n\n/,
  ""
);
content = content.replace(
  /  \/\/ Custom heavy objects added by user \(for AI method\)\n  const \[aiCustomHeavyObjects[\s\S]*?const superficieSpecialObjects = \[\.\.\.predefinedSpecialObjects, \.\.\.superficieCustomHeavyObjects\];\n\n/,
  ""
);
content = content.replace(
  /  const handleAddCustomRoom[\s\S]*?  const handleRemoveCustomRoom[\s\S]*?  \};\n\n/,
  ""
);

// Remove AI/superficie heavy handlers and canContinueAI / _dateOptions
removeBlock("  // AI method heavy object handlers", "  // Active: confirmation after Paris LP form submit");
removeBlock("  const _dateOptions = [", "  // Active: confirmation after Paris LP form submit");

// Replace inline confirmation with nothing (early return at top)
removeBlock("  // Active: confirmation after Paris LP form submit\n  if (currentPage === \"quote-confirmation\") {", "  // @legacy-tunnel — /tunnel/devis, /tunnel/info, /tunnel/options (archived routes)");

// Remove quote/info/options block
removeBlock("  // @legacy-tunnel — /tunnel/devis, /tunnel/info, /tunnel/options (archived routes)", "  return (\n    <div className=\"bg-slate-50\">\n      {/* Header */}\n      <header className=\"bg-white border-b border-slate-200\">");

// Simplify render layout - remove isParisLpVolumeCalc conditionals (always Paris list page)
content = content.replace(/isParisLpVolumeListPage/g, "true /* paris volume list */");
content = content.replace(/isParisLpVolumeCalc/g, "true /* paris volume calc */");

// Fix the broken const true - revert bad replacements in variable declarations if any
content = content.replace(/const true \/\* paris volume calc \*\/ =/g, "// removed");

// Remove form/methods titles and mobile progress
removeBlock(`              {currentPage === "form" && (
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-6 sm:mb-8">
                  Votre devis de déménagement
                </h1>
              )}`, `              {/* @legacy-tunnel — step 2 title: /tunnel/choix-volume */}`);
removeBlock(`              {currentPage === "methods" && (
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-6 sm:mb-8">
                  Choisissez votre méthode d&apos;estimation
                </h1>
              )}`, `              {currentPage !== "form" && currentPage !== "methods" && (`);
removeBlock(`              {currentPage !== "form" && currentPage !== "methods" && (
                <h1 className="sr-only">Demande de devis de déménagement — Guivarche</h1>
              )}`, `              {/* Mobile progress */}`);
removeBlock(`              {/* Mobile progress */}
              {!true /* paris volume calc */ ? (`, `              {true /* paris volume calc */ && !true /* paris volume list */ ? (`);
removeBlock(`              {!true /* paris volume calc */ ? (
              <div className="lg:hidden mb-5`, `              ) : null}

              {true /* paris volume calc */ && !true /* paris volume list */ ? (`);

// Remove legacy form and methods UI
removeBlock(`              {/* @legacy-tunnel — step 1 UI: /tunnel/mes-coordonnees */}`, `              {/* @legacy-tunnel — step 2 UI: /tunnel/choix-volume */}`);
removeBlock(`              {currentPage === "methods" && (`, `              {/* Volume liste: active /lp/paris/calcule-volume`);

// Simplify volume list wrapper
content = content.replace(
  /              \{\/\* Volume liste: active \/lp\/paris\/calcule-volume; @legacy-tunnel \/tunnel\/mon-volume\/liste \*\/\}\n              \{currentPage === "volume" && selectedMethod === "list" && \(\n                <>\n                  \{!true \/\* paris volume list \*\/ \? \([\s\S]*?\) : null\}\n\n                  \{\/\* Room Navigation \*\/\}/,
  "              {/* Volume liste — /lp/paris/calcule-volume */}\n              <>\n                  {/* Room Navigation */}"
);

// Remove surface through addresses UI
removeBlock(`              )}

              {/* @legacy-tunnel — /tunnel/mon-volume/surface */}`, `            </div>
          </div>

          {/* Sidebar */}`);
content = content.replace(/                <\/>\n              \)\}\n\n            <\/div>/, "                </>\n\n            </div>");

// Fix button labels
content = content.replace(/\{true \/\* paris volume calc \*\/ \? "RETOUR AU DEVIS" : "RETOUR"\}/g, '"RETOUR AU DEVIS"');
content = content.replace(/\{true \/\* paris volume calc \*\/ \? "VALIDER MON VOLUME →" : "CONTINUER →"\}/g, '"VALIDER MON VOLUME →"');

// Simplify grid classes
content = content.replace(
  /className=\{cn\(\n          "max-w-8xl mx-auto px-4 sm:px-6 py-6 sm:py-12",\n          true \/\* paris volume list \*\/ && "max-w-\[1280px\]",\n        \)\}/,
  'className="max-w-8xl mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-[1280px]"'
);
content = content.replace(
  /className=\{cn\(\n            "grid gap-6 lg:gap-8 xl:gap-10",\n            true \/\* paris volume list \*\/[\s\S]*?\)\}/,
  'className="grid gap-6 lg:gap-8 xl:gap-10 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]"'
);
content = content.replace(
  /<div className=\{cn\("min-w-0", !true \/\* paris volume list \*\/ && !true \/\* paris volume calc \*\/ && "lg:col-span-2"\)\}>/,
  '<div className="min-w-0">'
);
content = content.replace(
  /\{true \/\* paris volume list \*\/ \? <ParisVolumeCalcHowItWorks className="mb-8" \/> : null\}/,
  '<ParisVolumeCalcHowItWorks className="mb-8" />'
);
content = content.replace(
  /\{true \/\* paris volume calc \*\/ && !true \/\* paris volume list \*\/ \? \([\s\S]*?\) : null\}/,
  ""
);
content = content.replace(
  /\{true \/\* paris volume list \*\/ \? \(\n                <h1 className="sr-only">Calculer mon volume automatiquement<\/h1>\n              \) : null\}/,
  '<h1 className="sr-only">Calculer mon volume automatiquement</h1>'
);

// Sidebar - only ParisVolumeCalcSidebar
content = content.replace(
  /          \{true \/\* paris volume list \*\/ \? \(\n            <ParisVolumeCalcSidebar[\s\S]*?\) : null\}/,
  `          <ParisVolumeCalcSidebar
              roomObjectQuantities={roomObjectQuantities}
              specialObjectQuantities={specialObjectQuantities}
              onReset={resetParisVolumeInventory}
              className="lg:sticky lg:top-6 lg:self-start"
            />`
);

// Remove footer trust badges
removeBlock(`        {/* Footer Trust Badges */}
        {!true /* paris volume calc */ ? (`, `      </div>
    </div>
  );
}

function shouldUseTrailingSlash`);

// Clean unused imports - will fix after build

fs.writeFileSync(appPath, content);
console.log("Done. Lines:", content.split("\n").length);
