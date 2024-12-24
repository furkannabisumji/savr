import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Terms() {
  return (
    <div className="flex  h-full  overflow-y-auto leading-relaxed">
      <p>
        The ROSCA group, known as [Group Name], is established to facilitate
        collective savings and provide each member a lump sum payment during
        their designated turn. Membership is limited to [number] individuals who
        commit to the entire cycle. Each member contributes [amount] on a
        [weekly/bi-weekly/monthly] basis, with payments due by [specific date].
        The payout order will be determined by [method, e.g., lottery, mutual
        agreement], and any changes require unanimous consent. Meetings are held
        [frequency] at [location/online] to ensure transparency, during which
        the treasurer will report on collections and distributions. Late
        contributions incur a penalty of [amount], and persistent defaults may
        result in disqualification or other group-decided actions. All members
        are expected to maintain confidentiality regarding the group’s
        activities. Amendments to these terms can only be made with unanimous
        agreement, and the group will dissolve upon completion of the cycle
        unless a new cycle is agreed upon. By participating, all members agree
        to adhere to these terms, ensuring trust and accountability within the
        group.
      </p>
    </div>
  );
}
