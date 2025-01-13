import useTranslation from "next-translate/useTranslation";
import { FC, useState } from "react";

import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { Showcase as ShowcaseType } from "@/types/organisation";
import { formatDate } from "@/utilities/date-helper";

const Showcase: FC<ShowcaseType> = ({ title, date, description }) => {
  const { t, lang } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  return (
    <div
      className="block space-y-sm bg-white px-md py-lg no-underline"
      key={title}
    >
      <div className="text-sm text-textSecondary">
        {t("common|example")}
        {date && <> | {formatDate(lang, date)}</>}
      </div>
      <div className="text-lg text-textPrimary">{title}</div>
      <Button
        variant="plain"
        label={t("common|read-more")}
        size="sm"
        icon={ArrowRightIcon}
        iconPosition="right"
        onClick={() => setShowModal(true)}
      />
      <Modal
        heading={title}
        closeBtn={t("common|close")}
        description={description}
        text={`
          ${t("common|example")}
          ${date && ` | ${formatDate(lang, date)}`}
       `}
        textSize="md"
        modalOpen={showModal}
        setModalOpen={setShowModal}
      ></Modal>
    </div>
  );
};

export default Showcase;
