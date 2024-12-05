import CheckboxIcon from "@/assets/icons/checkbox.svg";
import CheckboxCheckedIcon from "@/assets/icons/checkboxChecked.svg";

interface SearchCheckboxFilterProps {
  id: string;
  name: string;
  checked?: boolean;
  onChange: () => void;
  label: string;
  iconSize: number;
}

export interface SearchCheckboxFilterIconProps {
  isChecked?: boolean;
  iconSize: number;
  className?: string;
}

export function SearchCheckboxFilterIcon({
  isChecked,
  iconSize,
  className = "",
}: SearchCheckboxFilterIconProps) {
  const Icon = isChecked ? CheckboxCheckedIcon : CheckboxIcon;
  return (
    <Icon
      height={iconSize * 1.5}
      width={iconSize * 1.5}
      viewBox="0 0 24 24"
      className={className}
    />
  );
}

export function SearchCheckboxFilter({
  id,
  name,
  checked = false,
  onChange,
  label,
  iconSize,
}: SearchCheckboxFilterProps) {
  return (
    <div className="relative max-w-fit">
      <input
        id={id}
        name={name}
        type="checkbox"
        className="peer sr-only"
        checked={!!checked}
        onChange={onChange}
      />
      <label
        className={`button button--small button--secondary z-2 focus--outline focus--primary relative cursor-pointer pr-xl 
          peer-checked:after:translate-x-full peer-focus-visible:bg-whiteOpaque5 peer-focus-visible:outline-dashed peer-focus-visible:outline-[3px] 
          peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary md:pr-xl`}
        htmlFor={id}
      >
        {label}
      </label>
      <SearchCheckboxFilterIcon
        isChecked={checked}
        iconSize={iconSize}
        className="pointer-events-none absolute right-sm top-1/4"
      />
    </div>
  );
}
