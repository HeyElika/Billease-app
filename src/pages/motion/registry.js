/**
 * Registry of Motion pattern pages, keyed by "<categoryId>/<patternId>".
 *
 * To add a motion type: add the category and its patterns to src/data/motion.js
 * for the navigation, then register each pattern's component here. The page
 * component renders only its DocSections and exports a SECTIONS array for the
 * right-hand table of contents.
 */

import SkeletonLoader from './SkeletonLoader'
import PageLoader from './PageLoader'
import InlineSpinner from './InlineSpinner'
import CardFlip from './CardFlip'
import CardCarousel from './CardCarousel'
import LockUnlock from './LockUnlock'
import BottomNavigation from './BottomNavigation'
import ContextualContentDocs from './ContextualContentDocs'
import StepForwardBack from './StepForwardBack'
import ToastDocs from './ToastDocs'
import BottomSheet from './BottomSheet'
import NewFlowEntry from './NewFlowEntry'
import DialogDocs from './DialogDocs'
import DrawerDocs from './DrawerDocs'
import TabSwitch from './TabSwitch'
import OtpSuccess from './OtpSuccess'
import OtpErrorShake from './OtpErrorShake'
import OtpAlert from './OtpAlert'
import InputFocus from './InputFocus'
import SelectionControls from './SelectionControls'
import AccordionDocs from './AccordionDocs'
import AppLaunch from './AppLaunch'

export const MOTION_PAGES = {
  'loader/skeleton': SkeletonLoader,
  'loader/page': PageLoader,
  'loader/spinner': InlineSpinner,
  'controls/card-flip': CardFlip,
  'navigation/card-carousel': CardCarousel,
  'controls/lock-unlock': LockUnlock,
  'navigation/bottom-navigation': BottomNavigation,
  'navigation/contextual-content': ContextualContentDocs,
  'navigation/step': StepForwardBack,
  'feedback/toast': ToastDocs,
  'overlays/bottom-sheet': BottomSheet,
  'overlays/new-flow-entry': NewFlowEntry,
  'overlays/dialog': DialogDocs,
  'overlays/drawer': DrawerDocs,
  'navigation/tab-switch': TabSwitch,
  'feedback/otp-success': OtpSuccess,
  'feedback/otp-error': OtpErrorShake,
  'feedback/otp-alert': OtpAlert,
  'controls/input-focus': InputFocus,
  'controls/selection': SelectionControls,
  'controls/accordion': AccordionDocs,
  'navigation/app-launch': AppLaunch,
}
