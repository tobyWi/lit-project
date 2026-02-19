export interface AppState {
  soundsGoodTotal: number;
  markedSectionIds: ReadonlySet<string>;
  contactUnlocked: boolean;
  openCardId: string | null;
  unlockVersion: number;
}

type StoreListener = (state: AppState) => void;

const CONTACT_UNLOCK_TARGET = 4;

class AppStore {
  private state: AppState = {
    soundsGoodTotal: 0,
    markedSectionIds: new Set<string>(),
    contactUnlocked: false,
    openCardId: null,
    unlockVersion: 0,
  };

  private listeners = new Set<StoreListener>();

  get unlockTarget() {
    return CONTACT_UNLOCK_TARGET;
  }

  getState(): AppState {
    return {
      ...this.state,
      markedSectionIds: new Set(this.state.markedSectionIds),
    };
  }

  subscribe(listener: StoreListener) {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  setOpenCard(cardId: string | null) {
    if (this.state.openCardId === cardId) {
      return;
    }

    this.state = {
      ...this.state,
      openCardId: cardId,
    };
    this.notify();
  }

  markSectionSoundsGood(sectionId: string) {
    if (!sectionId || this.state.markedSectionIds.has(sectionId)) {
      return false;
    }

    const markedSectionIds = new Set(this.state.markedSectionIds);
    markedSectionIds.add(sectionId);

    const soundsGoodTotal = markedSectionIds.size;
    const contactUnlocked = soundsGoodTotal >= CONTACT_UNLOCK_TARGET;
    const unlockedNow = !this.state.contactUnlocked && contactUnlocked;

    this.state = {
      ...this.state,
      markedSectionIds,
      soundsGoodTotal,
      contactUnlocked,
      openCardId: unlockedNow ? "contact" : this.state.openCardId,
      unlockVersion: unlockedNow
        ? this.state.unlockVersion + 1
        : this.state.unlockVersion,
    };
    this.notify();
    return true;
  }

  private notify() {
    const snapshot = this.getState();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }
}

export const appStore = new AppStore();
