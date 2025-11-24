interface PremiumFabricDescriptionProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function PremiumFabricDescription({
  value,
  onChange,
  disabled = false,
}: PremiumFabricDescriptionProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Décrivez les propriétés du tissu (optionnel)"
        rows={3}
        className="
          w-full px-4 py-3 
          border-2 border-gray-200 rounded-xl
          focus:border-green-500 focus:ring-2 focus:ring-green-200
          transition-all duration-200
          resize-none
          text-gray-700 placeholder-gray-400
          disabled:bg-gray-50 disabled:cursor-not-allowed
        "
      />
      <p className="text-xs text-gray-500 mt-2 text-center">
        Ex: Velours bleu marine, texture douce, aspect mat
      </p>
    </div>
  );
}
