export const levels = [
    // `\
    // # # # # #
    // #     ! #  ; red_goal
    // # ! ! ! #  ; red_walker_up zone red_goal; blue_goal; green_roller_left;
    // # ! ! ! #  ; blue_roller_down; red_roller_down; blue_walker_right green_goal
    // # # # # #
    // `,
    // `\
    //   # # #
    // # ! ! ! #  ; red_goal; green_walker_up; blue_goal
    // # ! ! ! #  ; green_roller_left; blue_walker_left zone; red_walker_right
    // # ! ! ! #  ; blue_roller_down; red_roller_up; green_goal
    //   # # #
    // `,
    `\
  # # # # #
#           #
# #   #   # #
#     #     #
# !   #   ! #  ; red_walker_up zone; red_goal
  # # # # #
`,
    `\
  # # # # #
#           #
# #   #   # #
#     #     #
# !   #   ! #  ; red_roller_up zone; red_goal
  # # # # #
`,
    `\
  # # # # # #
#             #
#   !     !   #  ; red_goal; blue_goal
#   !     !   #  ; red_walker_up zone; blue_walker_up
  # # # # # #
`,
    `\
  # # # # # # #
#               #
#   !   !   !   #  ; red_goal; green_goal; blue_goal
#   !   !   !   #  ; red_roller_up zone; green_roller_up; blue_roller_up
  # # # # # # #
`,
    `\
  # # # #
# ! ! ! ! #  ; green_goal zone; blue_walker_right; green_roller_left; blue_goal
# ! ! ! ! #  ; green_goal; blue_walker_right; green_roller_left; blue_goal
  # # # #
`,
    `\
  #
# ! #    ; red_goal blue_walker_down
# ! #    ; green_goal red_roller_down
# ! #    ; blue_goal
#     #
#     #
  # ! #  ; red_roller_up
  # ! #  ; green_walker_up blue_goal zone
  # ! #  ; blue_roller_up red_goal
    #
`,
    `\
    #
  #     #
# # #       #   #
  #     #   # #   #
  #     #   #     #
  #     #   #     #                         ! ; zone
`
];
