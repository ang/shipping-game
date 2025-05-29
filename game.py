from dataclasses import dataclass
import curses
import os
import time

planet_a_loc = 0
planet_b_loc = 10
planet_c_loc = 15

@dataclass
class Planet:
    name: str = "A"
    pos: int = 0

@dataclass
class Ship:
    destination1: Planet
    destination2: Planet
    name: str = "Ship 1"
    pos: int = 0
    direction: int = 1

money = 0

planet_a = Planet()
planet_b = Planet(name="B", pos=10)
planet_c = Planet(name="C", pos=15)

ship1 = Ship(name="Ship 1", destination1=planet_a, destination2=planet_b)
ship2 = Ship(name="Ship 2", destination1=planet_a, destination2=planet_c)
ships = [ship1, ship2]

def draw_display(display_win, ship_strs, info_strs):
    display_win.erase()
    display_win.box()

    ship_display_start = 1
    for index, ship_str in enumerate(ship_strs):
        display_win.addstr(ship_display_start + index, 2, ship_str)

    info_start = ship_display_start + len(ship_strs) + 3
    for index, info_str in enumerate(info_strs):
        display_win.addstr(info_start + index, 2, info_str)

    display_win.refresh()

def main(stdscr):
    # ========================

    curses.curs_set(1)  # Show the cursor
    stdscr.nodelay(True)  # Make getch() non-blocking
    stdscr.timeout(100)   # Refresh every 100ms

    max_y, max_x = stdscr.getmaxyx()

    input_win_height = 3
    display_win_height = max_y - input_win_height

    # Create windows
    display_win = curses.newwin(display_win_height, max_x, 0, 0)
    input_win = curses.newwin(input_win_height, max_x, display_win_height, 0)

    # ===========================

    time_so_far = 0
    money = 0

    # ==========================

    while True:
        ship_strs = []
        for ship in ships:
            ship_str = ""
            ship_str += ship.name + ": "
            ship_str += ship.destination1.name
            for i in range(ship.destination2.pos):
                if i == ship.destination1.pos or i == ship.destination2.pos:
                    pass
                elif i == ship.pos:
                    if ship.direction == 1:
                        ship_str += ">"
                    else:
                        ship_str += "<"
                else:
                    ship_str += "."
            ship_str += ship.destination2.name

            if ship.pos == ship.destination2.pos:
                ship.direction = -1
            elif ship.pos == ship.destination1.pos:
                ship.direction = 1
                if time_so_far != 0:
                    money += 1
            ship.pos += ship.direction

            ship_strs.append(ship_str)

        info_strs = []
        info_strs.append(f"Money: {money}")
        info_strs.append(f"Game ticks: {time_so_far}")
        time_so_far += 1

        draw_display(display_win, ship_strs, info_strs)

        time.sleep(0.5)

if __name__ == "__main__":
    curses.wrapper(main)
