import CheckboxCheckedIcon from "@/assets/icons/checkbox-checked.svg";
import CheckboxIcon from "@/assets/icons/checkbox.svg";

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
      height={iconSize}
      width={iconSize}
      viewBox="0 0 16 16"
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
    <div data-test-id="search-checkbox-filter" className="relative w-fit">
      <input
        id={id}
        name={name}
        type="checkbox"
        className="peer sr-only"
        checked={!!checked}
        onChange={onChange}
      />
      <label
        className={`button button--small button--secondary z-2 focus--outline focus--primary relative cursor-pointer 
          pl-xl peer-focus-visible:bg-whiteOpaque5 peer-focus-visible:outline-dashed 
          peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary`}
        htmlFor={id}
      >
        {label}
      </label>
      <SearchCheckboxFilterIcon
        isChecked={checked}
        iconSize={iconSize}
        className="pointer-events-none absolute left-md top-1/2 -translate-y-1/2"
      />
    </div>
  );
}
