import enum

import sqlalchemy as sqla

from . import types

class Like(enum.Enum):
    UP = 1
    MEH = 0
    DOWN = -1

def create_schema(
    conn: sqla.Connection,
    meta: sqla.MetaData,
):
    users = meta.tables["Users"]
    feeds = meta.tables["Feeds"]

    # Items.
    items = sqla.Table(
        "Items",
        meta,
        sqla.Column("ItemID", sqla.Integer, primary_key=True),
        sqla.Column("Title", types.TEXT, nullable=False),
        sqla.Column("Link", types.TEXT, nullable=False),
        sqla.Column("Published", sqla.DateTime, nullable=False),
        sqla.Column("FeedID", sqla.Integer, types.ForeignKey(feeds.c.FeedID), nullable=False),
        sqla.Column("Summary", types.MEDIUMTEXT),
        sqla.UniqueConstraint("Title", "Published", "FeedID"),
    )
    items.create(conn, checkfirst=True)

    # Likes.
    likes = sqla.Table(
        "Like",
        meta,
        sqla.Column("UserID", sqla.Integer, types.ForeignKey(users.c.UserID), nullable=False),
        sqla.Column("ItemID", sqla.Integer, types.ForeignKey(items.c.ItemID), nullable=False),
        sqla.Column("Score", sqla.Enum(Like), nullable=False),
        sqla.Column("Added", sqla.DateTime, server_default=sqla.func.now()),
        sqla.Column("Updated", sqla.DateTime, server_default=sqla.func.now(), server_onupdate=sqla.func.now()),
        sqla.UniqueConstraint("UserID", "ItemID"),
    )
    likes.create(conn, checkfirst=True)

    # Magic.
    magic = sqla.Table(
        "Magic",
        meta,
        sqla.Column("UserID", sqla.Integer, types.ForeignKey(users.c.UserID), nullable=False),
        sqla.Column("ItemID", sqla.Integer, types.ForeignKey(items.c.ItemID), nullable=False),
        sqla.Column("Score", sqla.Float, nullable=False),
        sqla.Column("Added", sqla.DateTime, server_default=sqla.func.now()),
        sqla.Column("Updated", sqla.DateTime, server_default=sqla.func.now(), server_onupdate=sqla.func.now()),
        sqla.UniqueConstraint("UserID", "ItemID"),
        sqla.CheckConstraint(
            "Score BETWEEN {} AND {}".format(Like.DOWN.value, Like.UP.value)
        ),
    )
    magic.create(conn, checkfirst=True)