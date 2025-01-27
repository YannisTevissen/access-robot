from lerobot.common.robot_devices.robots.manipulator import ManipulatorRobot
from lerobot.common.robot_devices.motors.feetech import FeetechMotorsBus
import numpy as np
import time

shoulder_pan_rest = -8.6132812e+00
shoulder_lift_rest = 1.9344727e+02
elbow_flex_rest = 1.8219727e+02
wrist_flex_rest = -40
wrist_roll_rest = 20
gripper_rest = 7.0422538e-02




class MyArm:
    def __init__(self):
        self.shoulder_pan = shoulder_pan_rest
        self.shoulder_lift = shoulder_lift_rest
        self.elbow_flex = elbow_flex_rest
        self.wrist_flex = wrist_flex_rest
        self.wrist_roll = wrist_roll_rest
        self.gripper = gripper_rest

        self.follower_port = "/dev/ttyACM0"
        self.follower_arm = FeetechMotorsBus(
            port=self.follower_port,
            motors={
                # name: (index, model)
                "shoulder_pan": (1, "sts3215"),
                "shoulder_lift": (2, "sts3215"),
                "elbow_flex": (3, "sts3215"),
                "wrist_flex": (4, "sts3215"),
                "wrist_roll": (5, "sts3215"),
            },
        )
        self.robot = ManipulatorRobot(
            robot_type="so100",
            follower_arms={"main": self.follower_arm},
            calibration_dir=".cache/calibration/so100",
        )

    def connect(self):
        self.robot.connect()

    def disconnect(self):
        self.robot.disconnect()

    def move_arm(self, position_dict):
        position = np.array(list(position_dict.values()))
        print(position)
        self.robot.follower_arms["main"].write("Goal_Position", position)
        follower_pos = self.robot.follower_arms["main"].read("Present_Position")
        print(follower_pos)

    def move_to_rest(self):
        rest_dict = {
            "shoulder_pan": shoulder_pan_rest,
            "shoulder_lift": shoulder_lift_rest,
            "elbow_flex": elbow_flex_rest,
            "wrist_flex": wrist_flex_rest,
            "wrist_roll": wrist_roll_rest,
            "gripper": gripper_rest,
        }
        self.move_arm(rest_dict)


if __name__ == '__main__':
    robot = MyArm()
    robot.connect()
    # position_dict = {
    #     "shoulder_pan": -8.6132812e+00,
    #     "shoulder_lift": 150,
    #     "elbow_flex": elbow_flex_rest,
    #     "wrist_flex": 100,
    #     "wrist_roll": -2.7578125e+00,
    #     "gripper": gripper_rest,
    # }
    # robot.move_arm(position_dict)
    # time.sleep(2)
    # position_dict = {
    #     "shoulder_pan": -8.6132812e+00,
    #     "shoulder_lift": 150,
    #     "elbow_flex": 20,
    #     "wrist_flex": 100,
    #     "wrist_roll": -2.7578125e+00,
    #     "gripper": 0.07,
    # }
    # robot.move_arm(position_dict)
    # time.sleep(2)
    robot.move_to_rest()
    robot.disconnect()