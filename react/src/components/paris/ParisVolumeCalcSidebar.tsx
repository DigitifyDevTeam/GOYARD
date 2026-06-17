import { useEffect, useMemo, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "../../lib/utils";

type InventoryItem = {
  name: string;
  quantity: number;
};

type ParisVolumeCalcSidebarProps = {
  roomObjectQuantities: Record<string, Record<string, number>>;
  specialObjectQuantities: Record<string, number>;
  onReset: () => void;
  className?: string;
};

const FAQ_ITEMS = [
  {
    question: "Que faire si je ne connais pas le volume exact de mon déménagement ?",
    answer:
      "Sélectionnez les objets pièce par pièce : notre outil calcule automatiquement le volume total à partir de votre inventaire. Vous pouvez aussi saisir votre superficie directement sur le formulaire de devis.",
  },
  {
    question: "Le volume estimé est-il 100 % fiable ?",
    answer:
      "L'estimation repose sur des volumes standards par type d'objet. Elle offre une base très fiable pour votre devis ; notre équipe affine le chiffrage final selon les accès et la logistique.",
  },
  {
    question: "Est-ce que je peux modifier mon inventaire plus tard ?",
    answer:
      "Oui. Vous pouvez revenir sur cette page, ajuster vos quantités ou remettre à zéro, puis valider à nouveau pour mettre à jour le volume sur votre devis.",
  },
  {
    question: "Mon devis est-il gratuit et sans engagement ?",
    answer:
      "Oui. Le devis est gratuit, personnalisé et sans engagement. Vous êtes recontacté sous 24 h avec un tarif clair adapté à votre déménagement.",
  },
] as const;

function aggregateInventoryItems(
  roomObjectQuantities: Record<string, Record<string, number>>,
  specialObjectQuantities: Record<string, number>,
): InventoryItem[] {
  const aggregated: Record<string, number> = {};

  Object.values(roomObjectQuantities).forEach((objects) => {
    Object.entries(objects).forEach(([name, quantity]) => {
      if (quantity > 0) {
        aggregated[name] = (aggregated[name] || 0) + quantity;
      }
    });
  });

  Object.entries(specialObjectQuantities).forEach(([name, quantity]) => {
    if (quantity > 0) {
      aggregated[name] = (aggregated[name] || 0) + quantity;
    }
  });

  return Object.entries(aggregated)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

function buildPreviewPayload(
  roomObjectQuantities: Record<string, Record<string, number>>,
  specialObjectQuantities: Record<string, number>,
) {
  const roomSelections: Record<string, Record<string, number>> = { autre: {} };

  Object.values(roomObjectQuantities).forEach((objects) => {
    Object.entries(objects).forEach(([name, quantity]) => {
      if (quantity > 0) {
        roomSelections.autre[name] = (roomSelections.autre[name] || 0) + quantity;
      }
    });
  });

  const heavyObjects: Record<string, number> = {};
  Object.entries(specialObjectQuantities).forEach(([name, quantity]) => {
    if (quantity > 0) {
      heavyObjects[name] = quantity;
    }
  });

  return {
    room_selections: roomSelections,
    heavy_objects: heavyObjects,
    custom_objects: {},
    custom_heavy_objects: {},
  };
}

function ParisVolumeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm" aria-labelledby="paris-volume-faq-title">
      <h3
        id="paris-volume-faq-title"
        className="mb-5 text-center font-['Poppins',sans-serif] text-xl sm:text-2xl font-extrabold text-[#1C3957]"
      >
        FAQ
      </h3>
      <div className="space-y-4">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.question} className="overflow-hidden rounded-xl bg-slate-100">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left font-['Poppins',sans-serif] text-base font-semibold text-[#1C3957] transition hover:bg-slate-200/60"
                aria-expanded={isOpen}
              >
                <span>
                  {index + 1}. {item.question}
                </span>
                <span className="mt-0.5 shrink-0 text-[#1C3957]" aria-hidden>
                  {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </span>
              </button>
              {isOpen ? (
                <p className="border-t border-slate-200/80 px-5 py-4 font-['Poppins',sans-serif] text-base leading-relaxed text-slate-600">
                  {item.answer}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ParisVolumeCalcSidebar({
  roomObjectQuantities,
  specialObjectQuantities,
  onReset,
  className,
}: Readonly<ParisVolumeCalcSidebarProps>) {
  const items = useMemo(
    () => aggregateInventoryItems(roomObjectQuantities, specialObjectQuantities),
    [roomObjectQuantities, specialObjectQuantities],
  );

  const [totalVolume, setTotalVolume] = useState<number | null>(null);
  const [volumeLoading, setVolumeLoading] = useState(false);

  const itemsKey = useMemo(() => JSON.stringify(items), [items]);

  useEffect(() => {
    if (items.length === 0) {
      setTotalVolume(null);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setVolumeLoading(true);
      try {
        const response = await fetch("/api/demenagement/rooms/preview/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPreviewPayload(roomObjectQuantities, specialObjectQuantities)),
          signal: controller.signal,
        });
        const result = await response.json();
        if (result.success && result.data?.total_volume != null) {
          setTotalVolume(result.data.total_volume as number);
        }
      } catch {
        if (!controller.signal.aborted) {
          setTotalVolume(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setVolumeLoading(false);
        }
      }
    }, 400);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [itemsKey, roomObjectQuantities, specialObjectQuantities]);

  const volumeLabel =
    items.length === 0
      ? "Inventaire total de 0 m³"
      : volumeLoading
        ? "Calcul du volume…"
        : totalVolume != null
          ? `Inventaire total de ${totalVolume.toFixed(2)} m³`
          : "Inventaire en cours…";

  return (
    <aside className={cn("space-y-8", className)}>
      <section
        className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm"
        aria-labelledby="paris-volume-recap-title"
      >
        <h3
          id="paris-volume-recap-title"
          className="mb-5 text-center font-['Poppins',sans-serif] text-xl sm:text-2xl font-extrabold text-[#1C3957]"
        >
          Récapitulatif
        </h3>
        <p className="mb-6 text-center font-['Poppins',sans-serif] text-lg sm:text-xl font-extrabold text-[#1C3957]">
          {volumeLabel}
        </p>

        {items.length > 0 ? (
          <ul className="mb-8 flex flex-wrap justify-center gap-x-5 gap-y-4">
            {items.map((item) => (
              <li key={item.name} className="flex items-center gap-2.5">
                <span className="flex h-8 min-w-[2rem] items-center justify-center rounded-full bg-[#CC922F] px-2 font-['Poppins',sans-serif] text-sm font-bold text-white">
                  {item.quantity}
                </span>
                <span className="font-['Poppins',sans-serif] text-base text-slate-500">{item.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-8 text-center font-['Poppins',sans-serif] text-base text-slate-400">
            Aucun objet sélectionné pour le moment.
          </p>
        )}

        <button
          type="button"
          onClick={onReset}
          disabled={items.length === 0}
          className="mx-auto block rounded-full bg-[#6B7280] px-8 py-3 font-['Poppins',sans-serif] text-base font-semibold text-white transition hover:bg-[#4B5563] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Remettre à zéro
        </button>
      </section>

      <ParisVolumeFaq />
    </aside>
  );
}
